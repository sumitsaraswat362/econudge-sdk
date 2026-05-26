'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Live Demo', path: '/demo' },
  { name: 'Impact', path: '/impact' },
  { name: 'Market', path: '/marketplace' },
  { name: 'Admin', path: '/admin' },
  { name: 'API', path: '/developers' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 inset-x-0 z-50 flex justify-center py-6 pointer-events-none"
    >
      <div className="glass-card flex items-center gap-2 px-4 py-2 pointer-events-auto shadow-2xl">
        {navLinks.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 rounded-xl bg-white/10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
