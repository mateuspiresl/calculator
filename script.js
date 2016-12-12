var symbols = new Set(['÷', 'x', '+', '-']);

var app = angular.module('calculator', []);

app.controller('calculator', function($scope) {
	// Clear current
	$scope.ce = function ()
	{
		if ($scope.expressionList.length)
		{
			$scope.expressionList.pop();
			parse();
		}
		
		if ($scope.expressionList.length)
			$scope.current = $scope.expressionList.last();
		else
			$scope.current = '0';
		
		console.log('Current cleared.');
	}
	
	// Clear expression
	$scope.ac = function ()
	{
		$scope.expression = '';
		$scope.expressionList = [];
		$scope.ce();
		console.log('Expression cleared.');
	}
	
	// Start cleared
	$scope.ac();
	
	function parse() {
		$scope.current = $scope.expressionList.last();
		$scope.expression = $scope.expressionList.join(' ');
	}
	
	function update(element)
	{
		var resultWasOnCurrent = $scope.resultOnCurrent;
		$scope.resultOnCurrent = false;
		
		if (symbols.has(element))
		{
			if (!$scope.expressionList.length)
				return;
			
			if ($scope.expressionList.length && symbols.has($scope.expressionList.last()))
				$scope.expressionList.last(element);
			else
				$scope.expressionList.push(element);
		}
		else
		{
			if (resultWasOnCurrent) $scope.ac();
			
			if (($scope.current === '0' && element === '0')
				 || ($scope.current.indexOf('.') != -1 && element == '.'))
				return;
			
			if (($scope.expressionList.length && symbols.has($scope.expressionList.last()))
					|| $scope.current === '0')
				$scope.expressionList.push(element);
			
			else if (!$scope.expressionList.length || $scope.expressionList.last().length < 13)
				$scope.expressionList.appendLast(element);
		}
		
		parse();
	}
	
	$scope.button = function ($event)
	{
		var element = $event.target.innerText;
		console.log('Element:' , element);
		
		if (element == '=')
		{
			if ($scope.expressionList.length === 0)
				return;
			
			if (symbols.has($scope.expressionList.last()))
				$scope.expressionList.pop();
			
			var result = $scope.expressionList.reduce(
				function (res, curr) {
					if (res.length < 2)
					{
						res.push(curr);
						return res;
					}
					
					if (res.last() == '÷')
						res.last('/');
					
					else if (res.last() == 'x')
						res.last('*');
					
					res.push(curr);
					return [eval(res.join(' '))];
				},
				[]
			).last();
			
			result = result.toString();
			if (result.length > 13)
			{
				var dot = result.indexOf('.');
				result = dot == -1
					? result.substr(0, 13)
					: parseFloat(parseFloat(result).toFixed(13 - dot - 1)).toString();
			}
			
			console.log('Result:', result);
			
			$scope.ac();
			update(result);
			$scope.resultOnCurrent = true;
		}
		else update(element);
	}
});



// ...

if (!Array.prototype.last) {
	Array.prototype.last = function (newVal) {
		if (newVal) this[this.length - 1] = newVal;
		return this[this.length - 1];
	};
}
	
if (!Array.prototype.appendLast) {
	Array.prototype.appendLast = function (val) {
		if (this.length === 0) return this.push(val);
		return (this[this.length - 1] += val);
	};
}