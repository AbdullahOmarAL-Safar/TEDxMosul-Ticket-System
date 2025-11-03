import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Booking } from '../types';

/**
 * Generate and download a TEDxMosul ticket as PDF
 * @param booking - The booking object containing event and ticket information
 */
export const downloadTicketPDF = async (booking: Booking): Promise<void> => {
    try {
        // Create a temporary container for the ticket
        const ticketContainer = document.createElement('div');
        ticketContainer.style.position = 'absolute';
        ticketContainer.style.left = '-9999px';
        ticketContainer.style.width = '595px'; // A5 width in pixels (portrait)
        ticketContainer.style.height = '842px'; // A5 height in pixels
        ticketContainer.style.background = '#ffffff';
        ticketContainer.style.padding = '40px';
        ticketContainer.style.boxSizing = 'border-box';
        ticketContainer.style.fontFamily = 'Arial, sans-serif';

        // Generate the ticket HTML content
        ticketContainer.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                <!-- Header Section -->
                <div style="text-align: center; border-bottom: 3px solid #e62b1e; padding-bottom: 20px;">
                    <h1 style="margin: 0; font-size: 48px; font-weight: 900; color: #000;">
                        <span style="color: #000;">TED</span><span style="color: #e62b1e;">x</span><span style="color: #000;">Mosul</span>
                    </h1>
                    <p style="margin: 10px 0 0 0; font-size: 14px; color: #666; letter-spacing: 2px;">IDEAS WORTH SPREADING</p>
                </div>

                <!-- Ticket Type -->
                <div style="text-align: center; margin: 20px 0;">
                    <div style="display: inline-block; background: #e62b1e; color: white; padding: 8px 24px; border-radius: 20px; font-size: 14px; font-weight: 700; letter-spacing: 1px;">
                        EVENT TICKET
                    </div>
                </div>

                <!-- Event Details -->
                <div style="flex: 1; padding: 20px 0;">
                    <h2 style="font-size: 28px; font-weight: 700; color: #000; margin: 0 0 20px 0; text-align: center;">
                        ${booking.event.title}
                    </h2>
                    
                    <div style="margin: 30px 0;">
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 24px; margin-right: 15px;">📅</span>
                            <div>
                                <div style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Date & Time</div>
                                <div style="font-size: 16px; font-weight: 600; color: #000;">
                                    ${new Date(booking.event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
                                </div>
                                <div style="font-size: 14px; color: #666;">
                                    ${new Date(booking.event.date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })}
                                </div>
                            </div>
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 24px; margin-right: 15px;">📍</span>
                            <div>
                                <div style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Location</div>
                                <div style="font-size: 16px; font-weight: 600; color: #000;">${booking.event.location}</div>
                            </div>
                        </div>

                        ${booking.seats && booking.seats.length > 0 ? `
                        <div style="display: flex; align-items: center; margin-bottom: 15px;">
                            <span style="font-size: 24px; margin-right: 15px;">🪑</span>
                            <div>
                                <div style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Seat(s)</div>
                                <div style="font-size: 20px; font-weight: 700; color: #e62b1e;">
                                    ${booking.seats.map(s => `${s.row}${s.number}`).join(', ')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <!-- QR Code Section -->
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Scan at Event</div>
                    <div id="qr-code-placeholder" style="display: inline-block; background: #f5f5f5; padding: 15px; border-radius: 10px;">
                        <!-- QR Code will be inserted here -->
                    </div>
                    <div style="margin-top: 10px; font-size: 14px; font-weight: 600; color: #666;">
                        Booking ID: #${booking.id}
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; border-top: 2px solid #f0f0f0; padding-top: 20px; margin-top: 20px;">
                    <p style="margin: 0; font-size: 12px; color: #999;">
                        TEDxMosul – Ideas Worth Spreading
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 10px; color: #ccc;">
                        This ticket is non-transferable and valid for the specified event only
                    </p>
                </div>
            </div>
        `;

        // Add to DOM temporarily
        document.body.appendChild(ticketContainer);

        // Get the existing QR code from the page
        const existingQRElement = document.querySelector(`[data-booking-id="${booking.id}"] svg`);
        if (existingQRElement) {
            const qrCodePlaceholder = ticketContainer.querySelector('#qr-code-placeholder');
            if (qrCodePlaceholder) {
                // Clone the QR code SVG
                const clonedQR = existingQRElement.cloneNode(true) as SVGElement;
                clonedQR.setAttribute('width', '150');
                clonedQR.setAttribute('height', '150');
                qrCodePlaceholder.appendChild(clonedQR);
            }
        }

        // Wait for fonts and images to load
        await new Promise(resolve => setTimeout(resolve, 100));

        // Convert to canvas
        const canvas = await html2canvas(ticketContainer, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
        });

        // Remove temporary container
        document.body.removeChild(ticketContainer);

        // Create PDF
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a5',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Generate filename
        const filename = `TEDxMosul_Ticket_${booking.id}.pdf`;

        // Download
        pdf.save(filename);

        return Promise.resolve();
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate ticket PDF. Please try again.');
    }
};
