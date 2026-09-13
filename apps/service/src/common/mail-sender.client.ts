import axios, { AxiosInstance } from 'axios';

interface MailSenderOptions {
    baseURL: string;
    serviceId: string;
    userId: string;
    invoiceTemplateId: string;
    timeoutMs?: number;
}

export interface InvoiceEmailExpense {
    name: string;
    type: string;
    units: string;
    unitPrice: string;
    amount: string;
}

export class MailSenderClient {
    private readonly client: AxiosInstance;

    constructor(private readonly options: MailSenderOptions) {
        this.client = axios.create({
            baseURL: options.baseURL,
            timeout: options.timeoutMs ?? 15000,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    async sendInvoice(payload: {
        recipientEmail: string;
        providerName: string;
        locationName: string;
        locationCode: number;
        invoiceCode: number;
        dueDay: number;
        total: string;
        expenses: InvoiceEmailExpense[];
    }): Promise<{ success: true } | { success: false; error: string }> {
        try {
            await this.client.post('/api/v1.0/email/send', {
                service_id: this.options.serviceId,
                template_id: this.options.invoiceTemplateId,
                user_id: this.options.userId,
                template_params: {
                    email: payload.recipientEmail,
                    provider_name: payload.providerName,
                    location_name: payload.locationName,
                    location_code: payload.locationCode,
                    invoice_code: payload.invoiceCode,
                    due_day: payload.dueDay,
                    total: payload.total,
                    expenses: payload.expenses,
                },
            });

            return { success: true };
        } catch (error) {
            const responseStatus = axios.isAxiosError(error) ? error.response?.status : undefined;
            const errorCode = axios.isAxiosError(error) ? error.code : undefined;
            const errorMessage = responseStatus
                ? `Email API returned HTTP ${responseStatus}`
                : errorCode === 'ECONNABORTED' || errorCode === 'ETIMEDOUT'
                    ? 'Email API request timed out'
                    : 'Email API request failed';

            console.error('Invoice email delivery failed', { responseStatus, errorCode });
            return { success: false, error: errorMessage };
        }
    }
}
