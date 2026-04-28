const OPENAI_API_KEY = (typeof CONFIG !== 'undefined') ? CONFIG.OPENAI_API_KEY : '';
const OPENAI_MODEL   = 'gpt-4o-mini';
const MAX_TOKENS     = 160;

async function generateInsight(summary) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY_HERE') {
    return _mockInsight(summary);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model:    OPENAI_MODEL,
      messages: [{ role: 'user', content: _buildPrompt(summary) }],
      max_tokens:  MAX_TOKENS,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API returned ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function _buildPrompt(summary) {
  const approvalRate = summary.total > 0
    ? Math.round((summary.approved / summary.total) * 100)
    : 0;

  return (
    `You are an operations analyst for a retail store. ` +
    `Here is the current claims data:\n` +
    `- Total claims: ${summary.total}\n` +
    `- Pending: ${summary.pending} | Approved: ${summary.approved} | Rejected: ${summary.rejected}\n` +
    `- Damaged items: ${summary.damaged} | Missing items: ${summary.missing}\n` +
    `- Approval rate: ${approvalRate}%\n` +
    `- Total claims value: $${summary.totalAmount.toFixed(2)}\n\n` +
    `Write a 2–4 sentence operational insight. ` +
    `Focus on what stands out and what management should prioritize. ` +
    `Be practical and professional. Do not use bullet points.`
  );
}

function _mockInsight(summary) {
  const approvalRate = summary.total > 0
    ? Math.round((summary.approved / summary.total) * 100)
    : 0;

  const pendingNote = summary.pending > 3
    ? `The ${summary.pending} pending claims represent a growing backlog and should be reviewed within the next business day.`
    : `The pending claims queue is manageable at ${summary.pending} open items.`;

  const typeNote = summary.damaged > summary.missing
    ? `Damaged item reports (${summary.damaged}) outnumber missing items (${summary.missing}), pointing to potential packaging or in-transit handling issues.`
    : `Missing item reports (${summary.missing}) are outpacing damaged claims (${summary.damaged}), which may warrant an inventory audit.`;

  return (
    `Currently tracking ${summary.total} claims with a ${approvalRate}% approval rate and $${summary.totalAmount.toFixed(2)} in total exposure. ` +
    `${pendingNote} ` +
    `${typeNote} ` +
    `Consider prioritizing high-value pending claims to reduce financial risk.`
  );
}
