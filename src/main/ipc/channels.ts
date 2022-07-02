import WindowChannels from './windowChannels';
import CloseWindowChannel from './windowChannels/closeWindowChannel';
import MinimizeWindowChannel from './windowChannels/minimizeWindowChannel';
import MaximizeWindowChannel from './windowChannels/maximizeWindowChannel';

export type Channels = WindowChannels.CLOSE_WINDOW | WindowChannels.MAXIMIZE_WINDOW | WindowChannels.MINIMIZE_WINDOW;

export { CloseWindowChannel, MinimizeWindowChannel, MaximizeWindowChannel };
