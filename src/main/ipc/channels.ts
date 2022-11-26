import WindowChannels from './windowChannels';
import MiscChannels from './miscChannels';
import CloseWindowChannel from './windowChannels/closeWindowChannel';
import MinimizeWindowChannel from './windowChannels/minimizeWindowChannel';
import MaximizeWindowChannel from './windowChannels/maximizeWindowChannel';
import DirectoryPathChannel from './miscChannels/dirPathChannel';
import ReadMetadataChannel from './miscChannels/readMetadataChannel';
import AddTracksChannel from './miscChannels/addTracksChannel';

export type Channels = WindowChannels.CLOSE_WINDOW | WindowChannels.MAXIMIZE_WINDOW | WindowChannels.MINIMIZE_WINDOW | MiscChannels.ADD_TRACKS | MiscChannels.GET_METADATA | MiscChannels.GET_PATH;

export { CloseWindowChannel, MinimizeWindowChannel, MaximizeWindowChannel, DirectoryPathChannel, ReadMetadataChannel, AddTracksChannel };
