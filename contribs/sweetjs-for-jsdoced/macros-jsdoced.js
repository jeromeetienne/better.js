// base on http://sweetjs.org/doc/main/sweet.html#let-macros
let function = macro {
	// case for function with no name
	case {_ ($params ...) { $body ...} } => {
		return #{
			jsDoced(function($params ...) {
				$body ...
			})
		}
	}

	// case for function with a name
	case {_ $name ($params ...) { $body ...} } => {
		return #{
			function $name($params ...) {
				$body ...
			}
		}
	}
}

export function