// base on http://sweetjs.org/doc/main/sweet.html#let-macros
let function = macro {
	case {_ ($params ...) { $body ...} } => {
		return #{
			jsDoced(function($params ...) {
				$body ...
			})
		}
	}
}

export function