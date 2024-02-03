import Controls from '../../media/controls.png';
import SpaceKey from '../../media/spaceKey.png';

export const ControlsContainer = () => {

    return (
        <div className='controlsContainer'>
            <ArrowKeysContainer />

            <SpaceKeyContainer />
        </div>
    )
}

const ArrowKeysContainer = () => {

    return (
        <div className='arrowKeys'>
            <img src={Controls} height='60' width='100' alt='arrowKeys' />

            <div className='arrowsTitle'>- Move</div>
        </div>
    )
}

const SpaceKeyContainer = () => {

    return (
        <div className='spaceKey'>
            <img src={SpaceKey} height='30' width='50' alt='spaceKey' />

            <div className='spaceTitle'>- Pause</div>
        </div>
    )
}