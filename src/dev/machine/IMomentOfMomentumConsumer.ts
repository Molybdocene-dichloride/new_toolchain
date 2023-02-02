namespace Machine {
	export interface IMomentOfMomentumConsumer extends TileEntity {
		canReceiveAngularMomentum(side: number): boolean;
		receiveAngularMomentum(amount: number): number;
	}
}
