import React from 'react';

const Footer = () => {
  // Lista de desenvolvedores
  const developers = [
    "Caio",
    "Cesar", 
    "Matheus",
    "Marçal",
    "Marlon",
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Agenda de Atendimentos. Todos os direitos reservados.</p>
          <p className="mt-1 text-gray-500">
            Desenvolvido por: {developers.slice(0, -1).join(', ')} e {developers[developers.length - 1]}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;