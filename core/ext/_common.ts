export interface PropertiesInstance {
	get: (name: string) => any,
	set: (name: string, val: any) => any,
	watch: (propertyName: string, action: ((propertyName: string, oldValue: any, newValue: any) => void)) => void,
	mixinProperties: (target: any) => void,
	mixinRecursive: (target: any) => void,
	$njsWatch: {
		[ name: string ]: any[]
	}
};
export interface Properties {
	new(m: any): PropertiesInstance,
	mixin: (target: any) => ((target: any) => void)
};