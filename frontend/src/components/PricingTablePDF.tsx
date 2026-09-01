import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Eye, FileText } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/contact";
// Import the PDF from assets
import pricingTablePDF from "@/assets/pricing-table1.pdf";

const PricingTablePDF = () => {
  const handleDownload = () => {
    // Use the imported PDF from assets
    const link = document.createElement('a');
    link.href = pricingTablePDF;
    link.download = 'Dr-JSP-Pricing-Table.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreview = () => {
    // Open PDF from assets in new tab
    window.open(pricingTablePDF, '_blank');
  };

  const handleWhatsAppShare = () => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");

  return (
    <div className="text-center space-y-4">
      <Card className="inline-block shadow-card border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-semibold text-foreground">Complete Pricing Table</h4>
              <p className="text-sm text-muted-foreground">Share with patients via WhatsApp or print for clinic</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleDownload}
              variant="appointment"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
            
            <Button 
              onClick={handlePreview}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Preview PDF</span>
            </Button>
            
            <Button 
              onClick={handleWhatsAppShare}
              variant="outline"
              className="flex items-center space-x-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              <span>📱</span>
              <span>Share on WhatsApp</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingTablePDF;
