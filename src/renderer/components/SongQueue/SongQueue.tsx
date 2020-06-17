import * as React from 'react';

import './SongQueue.scss';

import ac1 from '../../../../resources/test-images/album-cover-1.jpg';
import ac2 from '../../../../resources/test-images/album-cover-2.jpg';
import ac3 from '../../../../resources/test-images/album-cover-3.jpg';

const SongQueue = () => {
    return (
        <div id="song-queue-container">
            <header>Up Next</header>
            <div id="song-queue">
                <div>
                    <img src={ac1} alt="" />
                </div>
                <div>
                    <img src={ac1} alt="" />
                </div>
                <div>
                    <img src={ac2} alt="" />
                </div>
                <div>
                    <img src={ac3} alt="" />
                </div>
                <div>
                    <img src={ac3} alt="" />
                </div>
                <div>
                    <img src={ac1} alt="" />
                </div>
            </div>
        </div>
    );
};

export default SongQueue;
