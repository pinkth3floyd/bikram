'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/app/core/ui/elements/Button';
// import { cn } from '@/app/core/ui/elements/ClassnameUtil';
import { HiMenu, HiX } from 'react-icons/hi';
import { Spinner } from '@/app/core/ui/elements/Spinner';   
import { cn } from '../elements/ClassnameUtil';

interface MainNavProps {
  navClass?: string;
  navJustify?: string;
}

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/' },
  // { name: 'Subscription', href: '/' },
  // { name: 'Privacy', href: '/' },
  // { name: 'Contact', href: '/' }

];

export default function MainNav({ navClass, navJustify }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [loadingNavItem, setLoadingNavItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = async (href: string, name: string) => {
    if (href === pathname) return;
    
    setLoadingNavItem(name);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await router.push(href);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setLoadingNavItem(null);
    }
  };

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await router.push('/sign-in');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      await router.push('/sign-up');
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const NavLink = ({ item, isMobile = false }: { item: NavItem; isMobile?: boolean }) => {
    const isLoading = loadingNavItem === item.name;
    const isActive = pathname === item.href;
    
    return (
      <Link
        href={item.href}
        className={cn(
          'relative',
          isMobile ? 'block px-3 py-2 rounded-md text-base font-medium' : 'px-3 py-2 rounded-md text-sm font-medium transition-colors',
          isActive
            ? 'bg-blue-500/20 text-blue-400'
            : 'text-gray-300 hover:text-white hover:bg-slate-800'
        )}
        onClick={(e) => {
          e.preventDefault();
          handleNavigation(item.href, item.name);
          if (isMobile) setIsOpen(false);
        }}
      >
        <span className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Spinner size="sm" />
              <span>Loading...</span>
            </>
          ) : (
            <span>{item.name}</span>
          )}
        </span>
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-300',
        isScrolled ? 'bg-slate-900 shadow-lg' : 'bg-slate-900',
        navClass
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">
                <span className="text-blue-500">Soc</span>
                <span className="text-green-500">ially</span>
                {/* <span className="text-yellow-500">Plus</span> */}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between flex-1 ml-10">
            <div className={cn('flex space-x-4', navJustify)}>
              {navItems.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-300 hover:text-white hover:bg-slate-800 border border-gray-700 min-w-[100px]"
                onClick={handleLogin}
                disabled={isLoginLoading}
              >
                <span className="flex items-center justify-center gap-2 w-full">
                  {isLoginLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </span>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white border-0 min-w-[100px]"
                onClick={handleRegister}
                disabled={isRegisterLoading}
              >
                <span className="flex items-center justify-center gap-2 w-full">
                  {isRegisterLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Register</span>
                  )}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-800"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <HiX className="block h-6 w-6" />
              ) : (
                <HiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn('md:hidden', isOpen ? 'block' : 'hidden')}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} isMobile={true} />
          ))}
          <div className="mt-4 space-y-2 p-2">
            <Button
              variant="ghost"
              className="w-full justify-center text-gray-300 hover:text-white hover:bg-slate-700 border border-gray-700"
              onClick={handleLogin}
              disabled={isLoginLoading}
            >
              <span className="flex items-center justify-center gap-2 w-full">
                {isLoginLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </span>
            </Button>
            <Button
              className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={handleRegister}
              disabled={isRegisterLoading}
            >
              <span className="flex items-center justify-center gap-2 w-full">
                {isRegisterLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>Register </span>
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}