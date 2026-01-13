'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Interior Visualizer', path: '/visualizer' },
    { name: 'Pool/Exterior Estimator', path: '/pool-estimator' },
    { name: 'HVAC Triage Agent', path: '/hvac-triage' },
    { name: 'Legal Case Intake', path: '/legal-intake' },
    { name: 'Voice Receptionist', path: '/voice-agent' },
    { name: 'Settings', path: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span>AI</span> Contractor
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
