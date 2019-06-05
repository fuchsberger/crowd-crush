import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

// brands
import fabGithub from '@fortawesome/fontawesome-free-brands/faGithub'
import fabYoutube from '@fortawesome/fontawesome-free-brands/faYoutube'

// regular icons
import farCircle from '@fortawesome/fontawesome-free-regular/faCircle'
import farClock from '@fortawesome/fontawesome-free-regular/faClock'
import farCompass from '@fortawesome/fontawesome-free-regular/faCompass'
import farCopyright from '@fortawesome/fontawesome-free-regular/faCopyright'
import farDotCircle from '@fortawesome/fontawesome-free-regular/faDotCircle'
import farEnvelope from '@fortawesome/fontawesome-free-regular/faEnvelope'
import farFileCode from '@fortawesome/fontawesome-free-regular/faFileCode'
import farHeart from '@fortawesome/fontawesome-free-regular/faHeart'
import farPlayCircle from '@fortawesome/fontawesome-free-regular/faPlayCircle'
import farTrashAlt from '@fortawesome/fontawesome-free-regular/faTrashAlt'
import farUser from '@fortawesome/fontawesome-free-regular/faUser'

// solid icons
import faBackward from '@fortawesome/fontawesome-free-solid/faBackward'
import faBullseye from '@fortawesome/fontawesome-free-solid/faBullseye'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faCircle from '@fortawesome/fontawesome-free-solid/faCircle'
import faCode from '@fortawesome/fontawesome-free-solid/faCode'
import faCog from '@fortawesome/fontawesome-free-solid/faCog'
import faCrosshairs from '@fortawesome/fontawesome-free-solid/faCrosshairs'
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import faFileCode from '@fortawesome/fontawesome-free-solid/faFileCode'
import faFilm from '@fortawesome/fontawesome-free-solid/faFilm'
import faForward from '@fortawesome/fontawesome-free-solid/faForward'
import faInfo from '@fortawesome/fontawesome-free-solid/faInfo'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faKey from '@fortawesome/fontawesome-free-solid/faKey'
import faLocationArrow from '@fortawesome/fontawesome-free-solid/faLocationArrow'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faPause from '@fortawesome/fontawesome-free-solid/faPause'
import faPencil from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus'
import faPowerOff from '@fortawesome/fontawesome-free-solid/faPowerOff'
import faRedoAlt from '@fortawesome/fontawesome-free-solid/faRedoAlt'
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faStepBackward from '@fortawesome/fontawesome-free-solid/faStepBackward'
import faStop from '@fortawesome/fontawesome-free-solid/faStop'
import faTable from '@fortawesome/fontawesome-free-solid/faTable'
import faTerminal from '@fortawesome/fontawesome-free-solid/faTerminal'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faTrash from '@fortawesome/fontawesome-free-solid/faTrash'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import faUnlockAlt from '@fortawesome/fontawesome-free-solid/faUnlockAlt'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faUsers from '@fortawesome/fontawesome-free-solid/faUsers'
import faUserPlus from '@fortawesome/fontawesome-free-solid/faUserPlus'
import faVideo from '@fortawesome/fontawesome-free-solid/faVideo'

fontawesome.library.add(
  // brands
  fabGithub,
  fabYoutube,

  // regular
  farCircle,
  farClock,
  farCompass,
  farCopyright,
  farDotCircle,
  farEnvelope,
  farFileCode,
  farHeart,
  farPlayCircle,
  farTrashAlt,
  farUser,

  // solid
  faBackward,
  faBullseye,
  faCheck,
  faCircle,
  faCode,
  faCog,
  faCrosshairs,
  faExclamationCircle,
  faForward,
  faFileCode,
  faFilm,
  faInfo,
  faInfoCircle,
  faKey,
  faLocationArrow,
  faLock,
  faPause,
  faPencil,
  faPlay,
  faPlus,
  faPowerOff,
  faRedoAlt,
  faSearch,
  faSpinner,
  faStepBackward,
  faStop,
  faTable,
  faTerminal,
  faTimes,
  faTrash,
  faTrashAlt,
  faUnlockAlt,
  faUser,
  faUsers,
  faUserPlus,
  faVideo
);

// Icon Wrapper for shorter syntax
// first two props should be prefix and icon
// Icons can now be used as: <Icon fas compass [...props] />
export default (props) => {
  const prefix = Object.keys(props)[0];
  const icon = Object.keys(props)[1];
  const { [prefix]: a, [icon]: b, ...rest } = props;
  return <FontAwesomeIcon icon={[prefix, icon]} {...rest}/>
}
