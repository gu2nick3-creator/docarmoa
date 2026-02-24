import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const phone = '5514981844470';
  const message = encodeURIComponent('Olá! Preciso de suporte na Do Carmo Modas.');
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
};

export default WhatsAppButton;
