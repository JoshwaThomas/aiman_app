import React from "react";
import { useHistory } from "react-router-dom";
import SignupForm from "@/components/drawer/SignupForm";
import Logo from "@/assets/img/logo/logo-dark.png";

const SignupPage = () => {
  const history = useHistory();

  const handleLoginNav = () => {
    history.push("/login");
  };

  return (
    <div className="font-['Inter',_sans-serif] text-slate-900 antialiased">
      
      {/* 🔹 Mobile Topbar (Visible only on Mobile) */}
      <div className="md:hidden bg-[#172272] text-white py-2 px-4 flex justify-between items-center text-[11px] font-bold tracking-wider uppercase">
        <a href="tel:+917339548002" className="flex items-center gap-1">
          📞 Call Support
        </a>
        <a href="https://www.aimancollege.edu.in/" target="_blank" rel="noreferrer" className="flex items-center gap-1">
          🌐 Visit Website
        </a>
      </div>

      {/* 🔹 Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
  <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
    
    {/* 🔹 Logo Section */}
    <div className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
      <img
        src={Logo}
        alt="Aiman College Logo"
        className="h-12 md:h-16 lg:h-20 w-auto object-contain"
      />
    </div>

    {/* 🔹 Right Side: Support & Actions */}
    <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
      
      {/* Phone Support (Clean & Minimal) */}
      <div className="hidden md:flex flex-col items-end">
        <a 
          href="tel:+917339548002" 
          className="text-base font-bold text-[#172272] hover:text-[#4EAB27] transition-colors flex items-center gap-2"
        >
          <span className="text-lg">📞</span> +91 733 954 8002
        </a>
      </div>

      {/* 🔹 Admission Help + Visit Website Cluster */}
      <div className="hidden md:flex flex-col items-center">
        
        <a 
          href="https://www.aimancollege.edu.in/" 
          target="_blank" 
          rel="noreferrer"
          className="px-5 py-2 border-2 border-[#172272] text-[#172272] text-xs font-bold rounded-full hover:bg-[#172272] hover:text-white transition-all uppercase tracking-wide"
        >
          Visit Website
        </a>
      </div>

      {/* 🔹 Vertical Divider (Desktop Only) */}
      <div className="hidden md:block h-10 w-[1px] bg-slate-200"></div>

      {/* 🔹 Primary Login Button */}
      <button
        onClick={handleLoginNav}
        className="px-8 py-3 bg-yellow-400 text-[#172272] text-sm font-extrabold rounded-full shadow-[0_4px_14px_0_rgba(250,204,21,0.4)] hover:bg-yellow-500 hover:shadow-yellow-500/30 transition-all active:scale-95 uppercase tracking-wider"
      >
        Login
      </button>
    </div>
  </div>
</header>

      <main>
        {/* 🔹 Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://www.aimancollege.edu.in/assets/images/banner/mainblock.jpeg" 
              className="w-full h-full object-cover"
              alt="Campus"
            />
            {/* 🔹 Gradient Overlay: Blue to Green at 0.6 Opacity */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#172272]/60 via-[#172272]/60 to-[#4EAB27]/60"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              
              {/* Left Content */}
              <div className="text-white max-w-xl text-center lg:text-left">
                
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
                  Build Your <br />
                  <span className="text-yellow-400">Future Career</span>
                </h1>
                <p className="mt-6 text-lg text-slate-100 font-light leading-relaxed">
                  Gain industry-ready skills with placement assistance and step into
                  success before you graduate. 
                </p>
                <div className="mt-8">
                  <a
                    href="https://www.aimancollege.edu.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#4EAB27] hover:bg-[#3d8a1e] text-white font-bold rounded-xl shadow-xl transition-all"
                  >
                    Learn More
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </a>
                </div>
              </div>

              {/* Form Card */}
              <div className="w-full max-w-md">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                  <div className="bg-[#4BAD30] py-6 px-8 border-b border-slate-100 text-center">
                    <h3 className="text-xl font-bold text-[#fff]">Create Your Account</h3>
                    <div className="w-12 h-1 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
                  </div>
                  <div className="p-0">
                    <SignupForm />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* 🔹 Footer */}
      <footer className="bg-[#172272] text-white py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-sm opacity-90 font-medium">
            © {new Date().getFullYear()} AIMAN COLLEGE OF ARTS AND SCIENCE FOR WOMEN
          </div>
          <div className="text-sm">
            <span className="opacity-70">Designed & Developed by </span>
            <a 
              href="https://ilifetech.in/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-yellow-400 font-bold hover:underline decoration-2 underline-offset-4"
            >
              ILife Technologies
            </a>
          </div>
        </div>
      </footer>

      {/* 🔹 WhatsApp Floating Button */}
      <a
        href="https://wa.me/917339548002"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-50 transition-transform hover:scale-110 active:scale-90"
      >
        <div className="bg-[#25D366] p-4 rounded-2xl shadow-[0_10px_25px_rgba(37,211,102,0.4)]">
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.43 5.623 1.43h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </a>

    </div>
  );
};

export default SignupPage;