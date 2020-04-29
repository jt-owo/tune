import { ExampleAction } from './exampleActions';
import { PlayerAction } from './playerActions';

export type RootActions = ExampleAction[keyof ExampleAction] | PlayerAction[keyof PlayerAction];
