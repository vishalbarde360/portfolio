
import "./index.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Mail,
  ArrowRight,
  Send,
  Download,
  MapPin,
  Calendar,
  User,
  ExternalLink,
  Code2,
  GraduationCap,
  Quote,
  Menu,
  X,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const API_BASE = "https://portfolio0-l0gv.onrender.com/api";
const RESEND_COOLDOWN = 45; // seconds, must match backend RESEND_COOLDOWN_SECONDS

const skills = [
  { name: "React", icon: "⚛️", color: "text-cyan-400" },
  { name: "Node.js", icon: "🟢", color: "text-green-500" },
  { name: "Express.js", icon: "🚂", color: "text-gray-300" },
  { name: "MongoDB", icon: "🍃", color: "text-green-400" },
  { name: "JavaScript", icon: "JS", color: "text-yellow-400" },
  { name: "HTML5", icon: "🔶", color: "text-orange-500" },
  { name: "CSS3", icon: "🔷", color: "text-blue-500" },
  { name: "Git & GitHub", icon: "🐙", color: "text-purple-400" },
];

const projects = [
  {
    image: "/images/chatapp.png",
    title: "Real-Time Chat Application",
    desc: "A real-time chat application using Socket.io with private messaging.",
    tag: "MERN Stack",
    demo: "https://chatapp-ecru-nine.vercel.app/",
    github: "https://github.com/vishalbarde360/whatsapp-clone.git",
  },
  {
    image: "/images/markwebix.png",
    title: "Cusrtomer Relationship Model application",
    desc: "Customer Relationship Management application to manage customers,leads,sales and interactions",
    tag: "MERN Stack",
    demo: "https://markwebix.vercel.app",
    github: "https://github.com/vishalbarde360/Markwebix-.git",
  },
  {
    title: "Music Streaming Application",
    desc: "Music streaming application to stream music",
    tag: "MERN Stack",
    demo: "#",
    github: "#",
  },
];

const academics = [
  {
    degree: "MCA (Master of Computer Applications)",
    institution: "MIT Arts, Commerce & Science College, Alandi,Pune",
    duration: "2024 – 2026",
    score: "CGPA: 7.9",
  },
  {
    degree: "BCA (Bachelor of Computer Applications)",
    institution: "Annasaheb Magar Mahavidyalaya, Hadapsar",
    duration: "2021 – 2024",
    score: "CGPA: 7.4",
  },
  {
    degree: "HSC (12th)",
    institution: "Dr.Dada Gujar Junior college, Tarawadewasti, Hadapsar",
    duration: "2019 – 2021",
    score: "Percentage: 74.33%",
  },
];

const navLinks = ["Home", "About", "Summary", "Academics", "Skills", "Projects", "Resume", "Contact"];

const App = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // OTP verification state
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Any time the user changes the email after verifying, force re-verification
  useEffect(() => {
    if (isEmailVerified) {
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtp("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      clearInterval(cooldownRef.current);
      return;
    }
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(cooldownRef.current);
  }, [resendCooldown > 0]);

  const handleSendOtp = async () => {
    if (!email.trim() || !emailRegex.test(email)) {
      toast.error("Please enter a valid email first");
      return;
    }
    try {
      setSendingOtp(true);
      const response = await axios.post(`${API_BASE}/otp/send`, { email });
      toast.success(response.data.message || "OTP sent to your email");
      setOtpSent(true);
      setResendCooldown(RESEND_COOLDOWN);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    try {
      setVerifyingOtp(true);
      const response = await axios.post(`${API_BASE}/otp/verify`, { email, otp: otp.trim() });
      toast.success(response.data.message || "Email verified");
      setIsEmailVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("All fields are required");
      return;
    }
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!isEmailVerified) {
      toast.error("Please verify your email with the OTP first");
      return;
    }
    if (message.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/contact`, {
        name,
        email,
        message,
      });
      toast.success(response.data.message || "Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
      setOtp("");
      setOtpSent(false);
      setIsEmailVerified(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#05050a] text-white overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="relative flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-white/5">
        <div className="text-xl font-bold tracking-wide">
          <img src="/images/avatar.jpeg" alt="logo" className="w-10 h-10 rounded-full object-cover" />
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className={`hover:text-white transition-colors ${i === 0 ? "text-white border-b-2 border-indigo-500 pb-1" : ""
                }`}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Desktop resume button */}
        <a
          href="/Vishal.resume.pdf"
          download="Vishal-Barde-Resume.pdf"
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Download Resume <Download size={16} />
        </a>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 origin-top bg-[#0a0a12] border-b border-white/10 shadow-xl shadow-black/40 transition-all duration-200 ease-out ${menuOpen
              ? "opacity-100 scale-y-100 pointer-events-auto"
              : "opacity-0 scale-y-95 pointer-events-none"
            }`}
        >
          <nav className="flex flex-col px-5 py-4 gap-1 text-sm font-medium text-gray-300">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={handleNavClick}
                className={`py-2.5 px-2 rounded-md hover:bg-white/5 hover:text-white transition-colors ${i === 0 ? "text-white bg-white/5" : ""
                  }`}
              >
                {link}
              </a>
            ))}
            <a
              href="/Vishal.resume.pdf"
              download="Vishal-Barde-Resume.pdf"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 mt-3 bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Download Resume <Download size={16} />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="grid md:grid-cols-2 gap-10 items-center px-5 sm:px-8 py-14 sm:py-20 max-w-6xl mx-auto"
      >
        <div className="text-center md:text-left">
          <p className="text-lg text-gray-300">Hi, I'm</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Vishal Barde
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2">
            <span className="text-green-400">MERN</span> Stack Developer
          </h2>
          <p className="text-gray-400 mt-4 max-w-md mx-auto md:mx-0">
            I build modern, responsive and scalable web applications using
            React, Node.js, Express and MongoDB.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <a
              href="#projects"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              View Projects <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 border border-white/20 px-5 py-3 rounded-lg font-semibold hover:bg-white/5 transition-colors"
            >
              Contact Me <Send size={16} />
            </a>
          </div>
          <div className="flex justify-center md:justify-start gap-4 mt-6">
            <a
              href="https://github.com/vishalbarde360"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FaGithub size={18} />
            </a>
            <a
              href="https://linkedin.com/vishalbarde360"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href="mailto:bardevishal92@gmail.com"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Photo placeholder */}
        <div className="flex justify-center">
          <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-blue-500/10">
            <User size={80} className="text-indigo-300" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 grid md:grid-cols-2 gap-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <User className="text-indigo-300" size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">About Me</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hi, I'm Vishal — a MERN Stack Developer from Pune. I recently completed my MCA, and coding is something that started as a college subject but turned into what I actually enjoy doing. Along the way I kept building things on the side — a chat app, a CRM, small experiments — because that's how I actually learn a technology, not just by reading about it. Now that I'm done with my degree, I'm focused on building solid full-stack projects and looking for opportunities where I can keep growing as a developer.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex gap-2">
              <User size={16} className="text-indigo-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-400">Name</p>
                <p className="font-medium">Vishal Vinod Barde</p>
              </div>
            </div>
            <div className="flex gap-2">
              <MapPin size={16} className="text-indigo-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-400">Location</p>
                <p className="font-medium">Pune, Maharashtra</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Calendar size={16} className="text-indigo-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-400">Age</p>
                <p className="font-medium">22</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Mail size={16} className="text-indigo-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-medium break-all">bardevishal92@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section id="summary" className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <Quote className="absolute -top-2 -left-2 text-indigo-500/10" size={90} />
          <div className="relative flex gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Code2 className="text-indigo-300" size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Summary</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Currently in my final year of MCA, and web development is something I keep coming back to outside of college too. Most of my time goes into building things with React and Node — a chat app, a CRM, small tools here and there — mainly because I learn best by actually building and breaking stuff. I like handling the full picture of a project: figuring out how the frontend should feel, and then building the backend and database to make it actually work. Still learning a lot, but at a point now where I can take an idea and turn it into a working app on my own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Details */}
      <section id="academics" className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <h3 className="text-2xl font-bold text-center inline-block border-b-2 border-indigo-500 pb-2 mb-8 w-full">
          Academic Details
        </h3>
        <div className="flex flex-col gap-4">
          {academics.map((edu) => (
            <div
              key={edu.degree}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-start gap-4 hover:border-indigo-500/50 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <GraduationCap className="text-indigo-300" size={20} />
              </div>
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <p className="font-bold">{edu.degree}</p>
                  <p className="text-sm text-gray-400">{edu.institution}</p>
                </div>
                <div className="text-sm text-left sm:text-right shrink-0">
                  <p className="text-gray-300">{edu.duration}</p>
                  <p className="text-green-400 font-medium">{edu.score}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="max-w-5xl mx-auto px-5 sm:px-8 py-10 text-center">
        <h3 className="text-2xl font-bold inline-block border-b-2 border-indigo-500 pb-2 mb-8">
          My Skills
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {skills.map((s) => (
            <div
              key={s.name}
              className="bg-white/5 border border-white/10 rounded-xl py-6 flex flex-col items-center gap-2 hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="text-sm font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-center">
        <h3 className="text-2xl font-bold inline-block border-b-2 border-indigo-500 pb-2 mb-8">
          My Projects
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.title}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden text-left hover:border-indigo-500/50 transition-colors"
            >
              <div className="h-36 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                {p.image && (
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-5">
                <h4 className="font-bold mb-1">{p.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{p.desc}</p>
                <span className="flex items-center gap-1 text-xs text-green-400 mb-3">
                  <span className="w-2 h-2 rounded-full bg-green-400" /> {p.tag}
                </span>
                <div className="flex gap-4 text-sm">
                  <a
                    href={p.demo}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    <ExternalLink size={14} /> Live Demo
                  </a>
                  <a
                    href={p.github}
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    <FaGithub size={14} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <Send className="text-indigo-300" size={18} />
            </div>
            <h3 className="text-xl font-bold">Let's Connect</h3>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            I'm currently looking for new opportunities. My inbox is always open.
          </p>

          <form onSubmit={sendMessage} className="flex flex-col gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter name"
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                  disabled={isEmailVerified}
                  className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {isEmailVerified ? (
                  <span className="flex items-center justify-center gap-2 text-sm font-medium text-green-400 border border-green-500/30 bg-green-500/10 rounded-lg px-4 py-3 whitespace-nowrap">
                    <ShieldCheck size={16} /> Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || resendCooldown > 0}
                    className="flex items-center justify-center gap-2 border border-white/20 px-4 py-3 rounded-lg text-sm font-semibold hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {sendingOtp ? (
                      "Sending..."
                    ) : resendCooldown > 0 ? (
                      `Resend in ${resendCooldown}s`
                    ) : otpSent ? (
                      <>
                        <RefreshCw size={14} /> Resend OTP
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                )}
              </div>

              {otpSent && !isEmailVerified && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-colors tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyingOtp}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {verifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message"
              rows="5"
              className="bg-black/30 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !isEmailVerified}
              title={!isEmailVerified ? "Verify your email first" : undefined}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-500 px-4 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              {loading ? "Sending..." : "Get In Touch"} <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default App;

