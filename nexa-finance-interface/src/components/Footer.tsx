const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4">
      <div className="container-app">
        <p className="text-sm text-gray-400 text-center">
          Nexa Finance {currentYear} - Desenvolvido pelo <strong>Grupo 10</strong> sob
          tutoria do DevClub. <strong>TypeScript</strong>,
          <strong> React</strong> e <strong>Tailwind CSS</strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
