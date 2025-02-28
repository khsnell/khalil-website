'use client'

import Link from 'next/link';

export function toggleMenu() {
	const menu = document.getElementById("nav");

	if (menu) {
		if (menu?.className.indexOf("hidden") !== -1) {
			menu.className = "block text-center";
		} else {
			menu.className = "hidden md:block text-center";
		}
	}
}

export default function Header() {
    return (
        <>
		<div>
			<div id="header" className="bg-red-700 h-32 md:w-full">
				<div id="banner" className="text-center md:text-left">
					<img 
						id="profile" 
						className="inline-block mt-4 ml-10 rounded-full size-24 shrink-0 md:size-64"
						src="./khalil.jpg" />
					<img 
						id="menu" 
						className="float-right mt-16 size-12 shrink-0 md:hidden"
						src="./menu_icon.png"
						onClick={toggleMenu}
					/>
				</div>
			</div>
		</div>
		<div id="nav" className="hidden md:block md:text-center">
			<ul>
				<li className="md:inline-block p-2">
					<Link href="/">Resume</Link>
				</li>
				<li className="md:inline-block p-2">
					<Link href="https://github.com/khsnell">GitHub</Link>
				</li>
			</ul>
		</div>
        </>
    )
}