type RfqNotificationInput = {
  rfqId: string;
  requesterName: string;
  requesterEmail: string;
  requesterCompany: string | null;
  productRequest: string;
  categorySlug: string | null;
  quantity: string;
  destinationCountry: string;
  targetTimeline: string | null;
  notes: string | null;
  productSlug: string | null;
  supplierSlug: string | null;
  attachmentName: string | null;
  attachmentSize: number | null;
  attachmentType: string | null;
  attachmentUrl: string | null;
  inquiryType: "general" | "product";
};

type RfqEmailConfig = {
  apiKey: string;
  from: string;
  to: string;
};

function getRfqEmailConfig(): RfqEmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RFQ_NOTIFICATION_FROM;
  const to = process.env.RFQ_NOTIFICATION_TO;

  if (!apiKey || !from || !to) {
    return null;
  }

  return { apiKey, from, to };
}

function formatOptional(label: string, value: string | number | null) {
  return value ? `${label}: ${value}` : null;
}

function formatAttachment(input: RfqNotificationInput) {
  if (!input.attachmentName) {
    return null;
  }

  const size = input.attachmentSize
    ? `${Math.round(input.attachmentSize / 1024)} KB`
    : "size unavailable";
  const type = input.attachmentType || "type unavailable";

  return [
    `Attachment: ${input.attachmentName} (${type}, ${size})`,
    input.attachmentUrl
      ? `Secure review link (expires in 7 days): ${input.attachmentUrl}`
      : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

function buildRfqEmailText(input: RfqNotificationInput) {
  return [
    "A new TMP RFQ was submitted.",
    "",
    `Requester: ${input.requesterName}`,
    `Requester email: ${input.requesterEmail}`,
    formatOptional("Company", input.requesterCompany),
    `RFQ ID: ${input.rfqId}`,
    "",
    `Product request: ${input.productRequest}`,
    `Quantity: ${input.quantity}`,
    `Destination country: ${input.destinationCountry}`,
    `Inquiry type: ${input.inquiryType}`,
    formatOptional("Category slug", input.categorySlug),
    formatOptional("Product slug", input.productSlug),
    formatOptional("Supplier slug", input.supplierSlug),
    formatOptional("Target timeline", input.targetTimeline),
    formatAttachment(input),
    "",
    "Notes:",
    input.notes || "None",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export async function sendRfqNotification(input: RfqNotificationInput) {
  const config = getRfqEmailConfig();

  if (!config) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing RFQ email notification environment variables.");
    }

    console.warn("RFQ email notification skipped: email is not configured.");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `rfq-${input.rfqId}`,
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      reply_to: input.requesterEmail,
      subject: `New TMP RFQ: ${input.productRequest.slice(0, 80)}`,
      text: buildRfqEmailText(input),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to send RFQ email notification: ${body}`);
  }
}
