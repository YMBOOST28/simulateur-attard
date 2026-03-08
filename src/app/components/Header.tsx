import { Link } from "react-router";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#0B1F3B]/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="https://www.attard-multimedia.com/web/image/website/1/logo/attard-multimedia?unique=9a9f5b3"
            alt="Attard Multimédia" 
            className="h-12 w-auto"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const span = document.createElement('span');
              span.className = 'text-xl font-bold text-[#0B1F3B]';
              span.textContent = 'Attard Multimédia';
              e.currentTarget.parentNode?.appendChild(span);
            }}
          />
        </Link>
        
        <Link to="/commander">
          <Button 
            size="lg"
            className="bg-[#1DBF73] hover:bg-[#1DBF73]/90 text-white"
          >
            Je passe commande
          </Button>
        </Link>
      </div>
    </header>
  );
}
