import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import swishLogo from '../assets/SwishLogo.svg';
import Search from './Search';

function NavBar() {
  const location = useLocation();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const tabIndex = tabs.findIndex(tab => tab.path === currentPath);
    if (tabIndex !== -1) {
      setActiveTabIndex(tabIndex);
    }
  }, [location.pathname]);

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      if (currentTab) {
        setTabUnderlineLeft(currentTab.offsetLeft);
        setTabUnderlineWidth(currentTab.clientWidth);
      }
    }

    setTabPosition();
    window.addEventListener('resize', setTabPosition);

    return () => window.removeEventListener('resize', setTabPosition);
  }, [activeTabIndex]);

  const tabs = [
    { name: "TEAMS", path: "/" },
    { name: "STANDINGS", path: "/standings" },
    { name: "SCHEDULE", path: "/schedule" }
  ];

  return (
    <div className='relative flex flex-col md:flex-row md:items-center m-4'>
      <div className="flex justify-between items-center mb-4 md:mb-0">
        <a href='/' className='md:mb-4'>
          <img className='md:w-2/3 w-1/2' src={swishLogo} alt='Swish Logo' />
        </a>
        <div className='flex md:hidden'>
          <Search />
        </div>
      </div>
      <div className='relative w-full flex justify-between md:items-center'>
        <div className='flex gap-8'>
          {tabs.map((tab, idx) => (
            <Link
              key={idx}
              to={tab.path}
              ref={(el) => (tabsRef.current[idx] = el)}
              onClick={() => setActiveTabIndex(idx)}
              className='relative'
            >
              <p className={`hover:text-wOrange ${activeTabIndex === idx ? 'font-bold' : ''}`}>
                {tab.name}
              </p>
            </Link>
          ))}
        </div>
        <span
          className="md:mt-1 absolute bottom-0 top-7 h-1.5 bg-wOrange transition-all duration-300"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
        <div className='hidden md:flex'>
          <Search />
        </div>
      </div>
    </div>
  );
}

export default NavBar;