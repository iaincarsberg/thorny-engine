/*global define*/
define(
	[
		'thorny'
	], 
	function (
		Thorny
	) {
		return Thorny.extend(
			{
				dance: function () {
					console.log(
						this.data(undefined, 'cake'),
						this.data('dancing', true),
						this.data({a: 'b'}, 'cake'),
						this.data(undefined, 'cake')
						);
					return this;
				}
			}
		);
	}
);