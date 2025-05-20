import React, { useEffect, useRef } from "react";
import { Mail } from "lucide-react";

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement | null>(null);
  const socialIconsRef = useRef<HTMLDivElement | null>(null);
  const contactInfoRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const copyrightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ("IntersectionObserver" in window) {
      const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      };

      const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      }, appearOptions);

      if (logoRef.current) appearOnScroll.observe(logoRef.current);
      if (descriptionRef.current)
        appearOnScroll.observe(descriptionRef.current);
      if (contactInfoRef.current)
        appearOnScroll.observe(contactInfoRef.current);
      if (socialIconsRef.current)
        appearOnScroll.observe(socialIconsRef.current);
      if (copyrightRef.current) appearOnScroll.observe(copyrightRef.current);

      return () => {
        if (logoRef.current) appearOnScroll.unobserve(logoRef.current);
        if (descriptionRef.current)
          appearOnScroll.unobserve(descriptionRef.current);
        if (contactInfoRef.current)
          appearOnScroll.unobserve(contactInfoRef.current);
        if (socialIconsRef.current)
          appearOnScroll.unobserve(socialIconsRef.current);
        if (copyrightRef.current)
          appearOnScroll.unobserve(copyrightRef.current);
      };
    }
  }, []);

  const handleSocialHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.classList.add("animate-bounce");
    setTimeout(() => {
      e.currentTarget.classList.remove("animate-bounce");
    }, 1000);
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-50 text-black py-12 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-yellow-600"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-20 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <div
              ref={logoRef}
              className="transform translate-y-10 opacity-0 transition-all duration-1000 ease-out"
            >
              <a href="#" className="inline-block">
                <img
                  src="/images/logo.png"
                  alt="logo"
                  className="w-[200px] h-[60px] object-contain hover:scale-105 transition-transform duration-300"
                />
              </a>
            </div>
            <p
              ref={descriptionRef}
              className="mb-6 pr-4 transform translate-y-10 opacity-0 transition-all duration-1000 delay-300 ease-out"
            >
              We are a team of passionate visual artists, directors, and
              storytellers dedicated to pushing the boundaries of creativity.
              Our expertise spans across various genres and styles, ensuring
              that each project we undertake is a unique masterpiece. From
              high-impact motions to breathtaking visuals, we bring a wealth of
              experience and innovation to every frame.
            </p>
          </div>

          <div
            ref={contactInfoRef}
            className="transform translate-y-10 opacity-0 transition-all duration-1000 delay-500 ease-out"
          >
            <h2 className="text-2xl font-semibold mb-6 relative">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-yellow-600 transform scale-x-0 origin-left transition-transform duration-1000 group-hover:scale-x-100"></span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-center group">
                <div className="flex items-center w-full">
                  <Mail
                    size={20}
                    className="mr-2 text-yellow-600 transition-transform duration-300 group-hover:scale-125"
                  />
                  <span className="group-hover:text-yellow-600 transition-colors duration-300">
                    enquiry.nakestudios@gmail.com
                  </span>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="flex items-center w-full">
                  <Mail
                    size={20}
                    className="mr-2 text-yellow-600 transition-transform duration-300 group-hover:scale-125"
                  />
                  <span className="group-hover:text-yellow-600 transition-colors duration-300">
                    info@nakestudios.org
                  </span>
                </div>
              </div>

              <div
                ref={socialIconsRef}
                className="mt-[-32px] mb-12 md:mb-0 flex justify-start space-x-4 transform translate-y-10 opacity-0 transition-all duration-1000 delay-700 ease-out"
              >
                <a
                  href="https://www.instagram.com/nakestudios?igsh=ZzgwNjh0N3JyZzU3"
                  className="text-black hover:text-pink-500 transition-all duration-300 hover:scale-125"
                  aria-label="Instagram"
                  onMouseEnter={handleSocialHover}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="transition-transform duration-500"
                  >
                    <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.6 0 3 1.4 3 3v10c0 1.6-1.4 3-3 3H7c-1.6 0-3-1.4-3-3V7c0-1.6 1.4-3 3-3h10zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-black hover:text-blue-500 transition-all duration-300 hover:scale-125"
                  aria-label="Facebook"
                  onMouseEnter={handleSocialHover}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="transition-transform duration-500"
                  >
                    <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-black hover:text-yellow-400 transition-all duration-300 hover:scale-125"
                  aria-label="Threads"
                  onMouseEnter={handleSocialHover}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="transition-transform duration-500"
                  >
                    <path d="M12.95 2.37c-5.7 0-9.47 3.72-9.47 8.91 0 6.38 4.68 10.35 10.4 10.35 2.92 0 5.88-1.13 7.19-3.46l-1.63-1.05c-1.06 1.78-3.1 2.61-5.51 2.61-3.86 0-6.92-2.66-6.92-7.24 0-3.4 2.47-6.52 6.53-6.52 3.5 0 5.5 2.34 5.5 4.89 0 1.8-.98 3.21-2.77 3.21-1.37 0-2.34-.92-2.34-2.26 0-.68.37-1.15.89-1.15.33 0 .64.15.77.45.18.4.23.9.39 1.38l.25.8c.35 1.17.97 2.25 2.42 2.25 2.16 0 3.56-1.79 3.56-4.4 0-3.47-2.88-6.72-7.36-6.72z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={copyrightRef}
          className="border-t border-gray-300 mt-8 pt-8 text-center text-[14px] transform translate-y-10 opacity-0 transition-all duration-1000 delay-1000 ease-out"
        >
          <div className="flex items-center justify-center relative overflow-hidden group">
            <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300">
              © Copyright {new Date().getFullYear()}
            </span>
            <div className="mx-2 overflow-hidden">
              <img
                src="/images/logo.png"
                alt="logo"
                className="w-[100px] h-[100px] object-contain group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span className="group-hover:translate-y-0 translate-y-0 transition-transform duration-300">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: translateY(-100vh) rotate(360deg);
              opacity: 0;
            }
          }

          .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;
