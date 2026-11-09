import type { ReceiptData } from "./generateReceipt";

function escapeHtml(
  value: string,
): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatReceiptAmount(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toLocaleString(
      undefined,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}`;
  }
}

function createReceiptHtml(
  receipt: ReceiptData,
): string {
  const receiptNumber = escapeHtml(
    receipt.receiptNumber,
  );

  const bookingReference = escapeHtml(
    receipt.bookingReference,
  );

  const paymentReference = escapeHtml(
    receipt.paymentReference,
  );

  const passengerName = escapeHtml(
    receipt.passengerName,
  );

  const paymentMethod = escapeHtml(
    receipt.paymentMethod,
  );

  const paymentStatus = escapeHtml(
    receipt.paymentStatus,
  );

  const bookingDate = escapeHtml(
    receipt.bookingDate,
  );

  const generatedAt = escapeHtml(
    receipt.generatedAt,
  );

  const formattedAmount = escapeHtml(
    formatReceiptAmount(
      receipt.amount,
      receipt.currency,
    ),
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <meta
          name="description"
          content="SOG Airways payment receipt"
        />

        <title>
          SOG Airways Receipt - ${receiptNumber}
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            margin: 0;
            padding: 40px;
            color: #111827;
            background: #ffffff;
          }

          .receipt {
            width: 100%;
            max-width: 720px;
            margin: 0 auto;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 32px;
            background: #ffffff;
          }

          .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 32px;
          }

          .brand {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
          }

          .subtitle {
            margin-top: 6px;
            color: #6b7280;
            font-size: 14px;
          }

          .status {
            padding: 6px 10px;
            border-radius: 999px;
            background: #f3f4f6;
            color: #111827;
            font-size: 13px;
            font-weight: 700;
            text-transform: capitalize;
          }

          .section {
            margin-top: 24px;
          }

          .row {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }

          .label {
            color: #6b7280;
          }

          .value {
            max-width: 60%;
            font-weight: 600;
            text-align: right;
            overflow-wrap: anywhere;
          }

          .total {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #111827;
            border-bottom: 0;
            font-size: 20px;
            font-weight: 700;
          }

          .footer {
            margin-top: 32px;
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
            text-align: center;
          }

          @media (max-width: 600px) {
            body {
              padding: 16px;
            }

            .receipt {
              padding: 20px;
            }

            .header {
              flex-direction: column;
            }

            .row {
              flex-direction: column;
              gap: 6px;
            }

            .value {
              max-width: 100%;
              text-align: left;
            }
          }

          @media print {
            body {
              padding: 0;
            }

            .receipt {
              max-width: none;
              border: none;
              border-radius: 0;
            }
          }
        </style>
      </head>

      <body>
        <main class="receipt">
          <header class="header">
            <div>
              <div class="brand">
                SOG Airways
              </div>

              <div class="subtitle">
                Payment Receipt
              </div>
            </div>

            <div class="status">
              ${paymentStatus}
            </div>
          </header>

          <section class="section">
            <div class="row">
              <span class="label">
                Receipt Number
              </span>

              <span class="value">
                ${receiptNumber}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Booking Reference
              </span>

              <span class="value">
                ${bookingReference}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Payment Reference
              </span>

              <span class="value">
                ${paymentReference}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Passenger
              </span>

              <span class="value">
                ${passengerName}
              </span>
            </div>
          </section>

          <section class="section">
            <div class="row">
              <span class="label">
                Payment Method
              </span>

              <span class="value">
                ${paymentMethod}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Booking Date
              </span>

              <span class="value">
                ${bookingDate}
              </span>
            </div>

            <div class="row">
              <span class="label">
                Generated At
              </span>

              <span class="value">
                ${generatedAt}
              </span>
            </div>
          </section>

          <div class="row total">
            <span>
              Total Paid
            </span>

            <span>
              ${formattedAmount}
            </span>
          </div>

          <footer class="footer">
            Thank you for choosing SOG Airways.
            <br />
            Please keep this receipt for your records.
          </footer>
        </main>
      </body>
    </html>
  `;
}

export function downloadReceipt(
  receipt: ReceiptData,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const html = createReceiptHtml(receipt);

  const blob = new Blob(
    [html],
    {
      type: "text/html;charset=utf-8",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `${receipt.receiptNumber}.html`;

  link.setAttribute(
    "download",
    `${receipt.receiptNumber}.html`,
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export { createReceiptHtml };