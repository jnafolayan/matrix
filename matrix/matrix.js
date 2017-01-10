function Matrix() {
	var rows, columns, array;
	if(arguments.length === 1 && Array.isArray(arguments[0])) {
		array = arguments[0];
		rows = array.length;
		columns = array[0].length;
	} else {
		rows = arguments[0];
		columns = arguments[1];
	}

	rows = rows || 1;
	columns = columns || 1;

	this.rows = rows;
	this.columns = columns;

	if(array) {
		this.fromArray(array);
	} else {
		for(var y = 0; y < rows; y++) {
			this[y] = [];
			for(var x = 0; x < columns; x++) {
				this[y][x] = 0;
			}
		}
	}

	this._states = [];
}

Matrix.prototype = {
	/**
	 * Saves the current matrix's state.
	 */
	save: function() {
		this._states.unshift(this.toArray());
	},

	/**
	 * Restores the matrix to its most recent state.
	 */
	restore: function() {
		if(this._states.length > 0) {
			this.fromArray(this._states.shift());
		}
	},

	toArray: function() {
		var ret = [];
		for(var y = 0; y < this.rows; y++) {
			ret[y] = [];
			for(var x = 0; x < this.columns; x++) {
				ret[y][x] = this[y][x];
			}
		}

		return ret;
	},

	fromArray: function(arr) {
		for(var y = 0; y < this.rows; y++) {
			this[y] = [];
			for(var x = 0; x < this.columns; x++) {
				this[y][x] = arr[y][x];
			}
		}
	},

	copyFrom: function(matrix) {
		this.fromArray(matrix.toArray());
	},

	add: function(matrix) {
		if(matrix.size !== this.size) {
			return undefined;
		}

		var m = new Matrix(this.rows, this.columns);

		for(var y = 0; y < this.rows; y++) {
			for(var x = 0; x < this.columns; x++) {
				m[y][x] = this[y][x] + matrix[y][x];
			}
		}

		return m;
	},

	subtract: function(matrix) {
		if(matrix.size !== this.size) {
			return undefined;
		}

		var m = new Matrix(this.rows, this.columns);

		for(var y = 0; y < this.rows; y++) {
			for(var x = 0; x < this.columns; x++) {
				m[y][x] = this[y][x] - matrix[y][x];
			}
		}

		return m;
	},

	multiply: function(matrix) {
		// Scalar multiplication
		if(typeof matrix === "number") {
			var s = arguments[0];
			var m = new Matrix(this.rows, this.columns);

			for(var y = 0; y < this.rows; y++) {
				for(var x = 0; x < this.columns; x++) {
					m[y][x] = this[y][x] * s;
				}
			}

			return m;
		}

		if(this.columns !== matrix.rows) {
			return undefined;
		}

		var m = new Matrix(this.rows, matrix.columns);

		// Current coordinates in the new matrix
		var mCol = 0, mRow = 0;
		// Current coordinates in the passed in matrix
		var matCol = 0, matRow = 0;
		// Current value for a position in the new matrix
		var value = 0;
		// Loop over each row of the new matrix 
		for(var mRow = 0; mRow < m.rows; mRow++) {
			matCol = 0;
			matRow = 0;
			// Loop over each column in the new matrix
			for(var mCol = 0; mCol < m.columns; mCol++) {
				// Multiplier each index value by the corresponding matrix value
				for(var x = 0; x < this.columns; x++) {
					value += this[mRow][x] * matrix[matRow][matCol];
					// Increment the current matrix's y (row) value
					matRow += 1;
				}
				m[mRow][mCol] = value;
				matCol += 1;
				value = 0;
				matRow = 0;
			}
		}

		return m;
	},

	divide: function(matrix) {
		// Scalar division
		if(typeof matrix === "number") {
			var s = arguments[0];
			var m = new Matrix(this.rows, this.columns);

			for(var y = 0; y < this.rows; y++) {
				for(var x = 0; x < this.columns; x++) {
					m[y][x] = this[y][x] / s;
				}
			}

			return m;
		}

		if(this.columns !== matrix.rows) {
			return undefined;
		}

		var m = new Matrix(this.rows, matrix.columns);

		// Current coordinates in the new matrix
		var mCol = 0, mRow = 0;
		// Current coordinates in the passed in matrix
		var matCol = 0, matRow = 0;
		// Current value for a position in the new matrix
		var value = 0;
		// Loop over each row of the new matrix 
		for(var mRow = 0; mRow < m.rows; mRow++) {
			matCol = 0;
			matRow = 0;
			// Loop over each column in the new matrix
			for(var mCol = 0; mCol < m.columns; mCol++) {
				// Multiplier each index value by the corresponding matrix value
				for(var x = 0; x < this.columns; x++) {
					value += this[mRow][x] / matrix[matRow][matCol];
					// Increment the current matrix's y (row) value
					matRow += 1;
				}
				m[mRow][mCol] = value;
				matCol += 1;
				value = 0;
				matRow = 0;
			}
		}

		return m;
	},

	clone: function() {
		// return new Matrix(this.toArray());
	},

	get size() {
		return this.rows * this.columns;
	}
};
