import React, { useEffect, useState } from "react";
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import './style.css';

export const ScrollToTop = ({ scrollToTop, scrollToBottom }) => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                setShowTopBtn(true);
                setScrollHeight(window.pageYOffset>2000?(window.pageYOffset/2):0)    
            } else {
                setShowTopBtn(false);
            }
        });


        
        
    }, []);
    const goToTop = () => {
        setScrollHeight((pre)=>pre<700?0:pre)


        window.scrollTo({
            top: scrollHeight,
            behavior: "smooth",
        });
    };

    const goToBottom = () => {
        window.scrollTo({
            top: 8000,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {showTopBtn && <>
                {scrollToTop && <ExpandLessTwoToneIcon
                    className="top-icon-position icon-style"
                    onClick={goToTop}
                />}
                {scrollToBottom && <ExpandMoreTwoToneIcon
                    className="bottom-icon-position icon-style"
                    onClick={goToBottom}
                />}
            </>}
        </>
    )
}
