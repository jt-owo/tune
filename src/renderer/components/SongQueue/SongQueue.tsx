import * as React from 'react';

import './SongQueue.scss';

const SongQueue = () => {
    return (
        <div id="song-queue-container">
            <header>Up Next</header>
            <div id="song-queue">
                <div>
                    <img src="../../../../resources/test-images/album-cover-1.jpg" alt="" />
                </div>
                <div>
                    <img src="../../../../resources/test-images/album-cover-1.jpg" alt="" />
                </div>
                <div>
                    <img src="../../../../resources/test-images/album-cover-2.jpg" alt="" />
                </div>
                <div>
                    <img src="../../../../resources/test-images/album-cover-3.jpg" alt="" />
                </div>
                <div>
                    <img src="../../../../resources/test-images/album-cover-3.jpg" alt="" />
                </div>
                <div>
                    <img src="../../../../resources/test-images/album-cover-1.jpg" alt="" />
                </div>
            </div>
        </div>
    );
};

export default SongQueue;
