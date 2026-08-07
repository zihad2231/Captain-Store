const Footer = () => {
  return (
    <footer className="bg-light text-center text-muted py-4 mt-auto border-top">
      <div className="container">
        <p className="mb-0">
          &copy; {new Date().getFullYear()} NexCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
