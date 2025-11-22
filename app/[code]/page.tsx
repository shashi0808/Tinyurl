import { redirect, notFound } from 'next/navigation';
import pool from '@/lib/db';

export default async function RedirectPage({
  params,
}: {
  params: { code: string };
}) {
  const { code } = params;

  // Get the link
  const result = await pool.query(
    'SELECT target_url FROM links WHERE code = $1',
    [code]
  );

  if (result.rows.length === 0) {
    notFound();
  }

  const targetUrl = result.rows[0].target_url;

  // Update click count and last clicked time
  await pool.query(
    `UPDATE links
     SET total_clicks = total_clicks + 1,
         last_clicked_at = CURRENT_TIMESTAMP
     WHERE code = $1`,
    [code]
  );

  // Perform 302 redirect
  redirect(targetUrl);
}
