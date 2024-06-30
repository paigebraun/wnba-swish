import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import swishLogo from '../assets/SwishLogo.svg';

function NavBar() {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
    const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
    const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);

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
        { name: "HOME", path: "/" },
        { name: "STANDINGS", path: "/standings" },
        { name: "SCHEDULE", path: "/schedule" }
    ];

    return (
        <div className='flex items-center m-4'>
            <a href='/'>
                <img className='w-2/3' src={swishLogo} alt='Swish Logo' />
            </a>
            <div className='relative w-full'>
                <div className='flex gap-8 pl-8'>
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
                    className="absolute bottom-0 top-7 h-1.5 bg-wOrange transition-all duration-300"
                    style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
                />
            </div>
        </div>
    );
}

export default NavBar;