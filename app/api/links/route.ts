import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { generateCode, isValidUrl, isValidCode } from '@/lib/utils';
import { Link } from '@/lib/types';

// GET /api/links - List all links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = 'SELECT * FROM links ORDER BY created_at DESC';
    let params: string[] = [];

    // Add search filter if provided
    if (search) {
      query = `
        SELECT * FROM links
        WHERE code ILIKE $1 OR target_url ILIKE $1
        ORDER BY created_at DESC
      `;
      params = [`%${search}%`];
    }

    const result = await pool.query(query, params);
    const links: Link[] = result.rows;

    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch links' },
      { status: 500 }
    );
  }
}

// POST /api/links - Create a new link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target_url, code: customCode } = body;

    // Validate target URL
    if (!target_url || !isValidUrl(target_url)) {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      );
    }

    // Generate or validate custom code
    let code = customCode;
    if (customCode) {
      // Validate custom code format
      if (!isValidCode(customCode)) {
        return NextResponse.json(
          { error: 'Code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
      code = customCode;
    } else {
      // Generate random code
      code = generateCode(6);

      // Ensure generated code is unique
      let attempts = 0;
      while (attempts < 10) {
        const checkResult = await pool.query(
          'SELECT id FROM links WHERE code = $1',
          [code]
        );
        if (checkResult.rows.length === 0) break;
        code = generateCode(6);
        attempts++;
      }
    }

    // Try to insert the link
    try {
      const result = await pool.query(
        `INSERT INTO links (code, target_url)
         VALUES ($1, $2)
         RETURNING *`,
        [code, target_url]
      );

      const link: Link = result.rows[0];
      return NextResponse.json(link, { status: 201 });
    } catch (dbError: unknown) {
      // Check for unique constraint violation
      if ((dbError as { code?: string }).code === '23505') {
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
