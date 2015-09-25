# autolink test
assert = require 'assert'
autolink = require '../'

describe 'html escape',->
    it 'escape &',->
        assert.equal autolink("foo&bar"),"foo&amp;bar"
    it 'escape < >',->
        assert.equal autolink("foo</a>bar<a>"), "foo&lt;/a&gt;bar&lt;a&gt;"
    it 'escape " \'',->
        assert.equal autolink('foo">aaa</a>bbb<a href=\''), "foo&quot;&gt;aaa&lt;/a&gt;bbb&lt;a href=&#39;"

describe 'url linking',->
    describe 'scheme & host',->
        it 'hostname',->
            assert.equal autolink("foo http://example.net bar"), "foo <a href='http://example.net'>http://example.net</a> bar"
