import Module from '../Module';


class Container {
	containerList: { [name: string]: any } = {};
	setContainer = function(name: string, obj: any) {
		this.containerList[name] = obj;
	}
	getContainer = function(name: string) {
		return this.containerList[name];
	}
}
var container = new Container();
class ContainerModule extends Module {
	getProvides (name: string) {
		if (name === 'container') {
			return container;
		}
		return null;
	}
	constructor () {
		super();
		this.consumes = [
			{
				id: 'ninejs'
			}
		];
		this.provides = [
			{
				id: 'container'
			}
		];
	}
}
var result: Module = new ContainerModule();
export default result;