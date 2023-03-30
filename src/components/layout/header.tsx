import ProfileDropDown from '../profile-dropdown'
import './styles.scss';

const Header = () => {
  return (
    <div className='header'>
        <h1>Timie</h1>
    
        <ProfileDropDown />
    </div>
  )
}

export default Header