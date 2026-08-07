const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-4 mt-auto border-top">
      <div className="container">
        <div className="mb-2">
          &copy; {new Date().getFullYear()} Captain Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
