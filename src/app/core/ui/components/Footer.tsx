import React from "react"


export default function Footer(){
    return(
        <footer className="shadow-sm dark:shadow-gray-700 bg-white dark:bg-slate-900 px-6 py-4">
           <div className="container-fluid">
                <div className="grid grid-cols-1">
                   <div className="sm:text-center text-center mx-md-2 items-center justify-center">
                       <p className="mb-0 text-slate-400">© {(new Date().getFullYear())} Socially.  Design & Developed by Socially</p>
                   </div>
                </div>
               
           </div>
        </footer>
    )
}