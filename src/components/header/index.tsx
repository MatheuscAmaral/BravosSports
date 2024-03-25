import logo from "../../assets/bravosLogoBlack.png";    
import { FaBarsStaggered } from "react-icons/fa6";

const Header = () => {
    return (
        <div className="flex lg:hidden justify-between items-center px-5 bg-white w-full">
            <img src={logo} alt="logo" className="w-40 py-3"/>

            <FaBarsStaggered fontSize={23}/>
        </div>
    )
}

export default Header;
