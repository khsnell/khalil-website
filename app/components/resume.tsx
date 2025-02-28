export default function Resume() {
    return (
        <>
        <div id="content" className="text-center mt-4 md:mt-20">
			<h1 className="text-3xl font-bold">Khalil Snell</h1>
			<div 
				id="left-folio" 
				className="mt-4 md:float-left md:ml-10 md:mr-20 md:pr-5 md:border-r md:border-black"
			>
				<div id="contact">
					<h4 className="font-bold">CONTACT</h4>
					<ul>
						<li>1 Farwood Rd<br />
							Philadelphia, PA 19096</li>
						<li>khalil.snell@gmail.com</li>
						<li>(215) 370-4759</li>
					</ul>
				</div>
				<div id="skills" className="mt-4">
					<h4 className="font-bold">SKILLS</h4>
					<ul>
						<li>SQL</li>
						<li>HTML</li>
						<li>CSS</li>
						<li>JavaScript</li>
						<li>JQuery</li>
						<li>PHP</li>
						<li>Git</li>
						<li>GitHub</li>
						<li>React</li>
                        <li>Next.js</li>
						<li>Tailwind</li> 
					</ul>
				</div>
				<div id="education" className="mt-4">
					<h4 className="font-bold">EDUCATION</h4>
					<ul className="text-sm">
						<li>Carnegie Mellon University<br />
							May 2006<br />
							BS in Information Systems<br />
							Minor in Professional Writing<br />
						</li>
						<li>
							PromineoTech through<br />
							Community College of Philadelphia<br />
							August 2023<br />
							18 Week Front-End Web Dev Bootcamp<br />
						</li>
					</ul>
				</div>
			</div>
			<div id="right-folio" className="mt-6 md:text-left">
				<h4 id="exp-title" className="font-bold md:mb-4">EXPERIENCE</h4>
				<div className="experience text-sm">
					<div className="title ">Income Maintenance Caseworker</div> <div className="timespan">November 2014 - present</div><br />
					<div className="employer inline-block">Commonwealth of Pennsylvania</div> <div className="divider inline-block">|</div> <div className="location inline-block">Philadelphia, PA</div>
					<ul className="mt-4">
						<li>
							Using eCIS, CIS (Client Information System) to determine eligibility for financial assistance, Medicaid and 
							Supplemental Nutrition Assistance Program (SNAP)
						</li>
						<li> 
							Using the IEVS system to review computer matches with various agencies and Departments to determine continued 
							eligibility of customers 
						</li>
						<li>
							Responsible for remaining up to date with policy updates and changes
						</li>
					</ul>
				</div>
				<div className="experience text-sm mt-4">
					<div className="title">BrandingBrand</div> <div className="timespan">June 2008 - November 2011</div><br />
   					<div className="employer inline-block">Contractor / Developer</div> <div className="divider inline-block">|</div> <div className="location inline-block">Pittsburgh, PA</div>
					<ul className="mt-4">
						<li>
							Implemented web design for ASPEX Corporation (HTML / CSS)
						</li>
						<li>
							Made modifications to OSCommerce shop piece (PHP / MYSQL)
						</li>
						<li>
							Developed initial launch of Dicks Sporting Goods mobile website (PHP)
						</li>
						<li>
							Initial launch of JellyBelly mobile website and MyBuys implementaion (PHP / JQuery)
						</li>
						<li>
							Launches of Overtons and GanderMountain mobile websites (PHP / JQuery)
						</li>
					</ul>
				</div>
			</div>
        </div>
        </>
    );
}