import { test } from 'ember-qunit';
import { parse } from 'ember-ruby-hash-parser';

/*test("invalid ruby hash", function(assert) {
  assert.throws(
    function() {
      parse('{');
    },
    Error('expecting right bracket'),
    'missing right bracket'
  );

  assert.throws(
    function() {
      parse('{:foo=}');
    },
    Error('expecting fatarrow'),
    'malformed fatarrow'
  );

  assert.throws(
    function() {
      parse('{:foo}');
    },
    Error('expecting fatarrow'),
    'missing fatarrow'
  );

  assert.throws(
    function() {
      parse('');
    },
    Error('expecting left bracket'),
    'missing left bracket'
  );

  assert.throws(
    function() {
      parse('{:foo=>}');
    },
    Error('expecting value'),
    'missing value'
  );
});

test("empty hash", function(assert) {
  assert.deepEqual({}, parse('{}'));
});

test("string value", function(assert) {
  assert.deepEqual(
    {
      message: "hello world"
    },
    parse(`{:message=>"hello world"}`)
  );
});

test("string values", function(assert) {
  assert.deepEqual(
    {
      first: "hi",
      second: "there"
    },
    parse(`{:first=>"hi", :second=>"there"}`)
  );
});

test("hash value", function(assert) {
  assert.deepEqual(
    {
      message: { status: "400" },
    },
    parse(`{:message=>{:status=>"400"}}`)
  );
});


test("hash values", function(assert) {
  assert.deepEqual(
    {
      first: { status: "400" },
      second: { key: "123" }

    },
    parse(`{:first=>{:status=>"400"}, :second=>{:key=>"123"}}`)
  );
});

test("hash with string and hash values", function(assert) {
  assert.deepEqual(
    {
      body: {
        message: "bad request",
        params: {
          key: "123",
          auth: "486utj59flkmn"
        }
      },
    },
    parse(`{:body=>{:message=>"bad request", :params=>{:key=>"123", :auth=>"486utj59flkmn"}}}`)
  );
});



test("stringified json value", function(assert) {
  let stream = `{:msg=>"Bad Request", :body=>"{\"error\":{\"message\":\"Your message couldn't be sent because it includes content that other people on Facebook have reported as abusive.\",\"type\":\"OAuthException\",\"code\":368,\"error_data\":{\"sentry_block_data\":\"Aeghf8Duw8r8y3kHZ6tA3DT2qRiwY7poKrStt9IysRNj7VvRwGavsLm1ulmHcCKwT6sOfBV7dVnaeK9xN9LUhVZS5lRHq-DjqyiWE_jn2ikRtarPDN0ME3Li0JbdVCoixXaAIkpljMLgUlF8ekS1XpBB8XuvaLLcc1UziCWR5Q_IEV-sszZTkhVReD3Zu03cs1p1Wfj5Gl1f-t51N0ACtvnL-hI8vUK0_6kwfqcO7hfIxy3rM_fj-CnKW2c18xF03tNpqf5TuLlmbRZls177wAWR0_unfheY3HwKpLU0QP7bEook5riHnLT51wj3ztAXctM\",\"help_center_id\":0},\"error_subcode\":1346003,\"error_user_msg\":\"\",\"fbtrace_id\":\"AjN0MYUWoAc\"}}", :code=>"400", :params=>{:link=>"http://tititi.oodadev.com/discover?group_id=58a413648185f50fe1000080&parentEventId=58a426a49eb131000400239a&source=facebook", :picture=>"https://d3kmf17y82r5m3.cloudfront.net/image_montages/58a413729eb13100040018f4/facebook.jpg",:message=>"Philanthropic", :auth_token=>"EAAGCMJ0070ABAPryBrSFcHXauqnoLbPWWd8Xgm6kKSOqjakfZCvQAix6UmxuD9RvN1PWCz9hY0NnCtuUIMQDkiEqlAvMxXPwFJgbWNZBcQqmLXBhrYVxBKouC2CN4pIP2E71JWIfZBZAmEV0eifvxX4jJxusBPoZD",:page_id=>nil,:description=>"Discover our latest collection of interesting articles."}}`;

  let value = parse(`${stream}`);
  assert.equal(value['msg'],                'Bad Request');
  assert.equal(value['code'],               '400');
  assert.equal(value['params']['message'],  'Philanthropic');
  assert.equal(value['params']['page_id'],  'nil');

  let body = JSON.parse(value['body']);
  assert.equal(body['error']['error_subcode'], 1346003);
});*/


test("xml value", function(assert) {
  let stream = `{:msg=>"Bad Request", :body=>"<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<error>\n  <status>400</status>\n  <timestamp>1486659636523</timestamp>\n  <request-id>6CV7NDG1UD</request-id>\n  <error-code>0</error-code>\n  <message>Invalid value {tZzjni39uS} in key {id}</message>\n</error>\n", :code=>"400", :params=>{:link=>"http://stamm1tester.oodadev.com/discover?group_id=588f6ac8b7a348000f000041&parentEventId=589ca0347aec7d00042d6390&source=linkedin", :image=>"https://d3kmf17y82r5m3.cloudfront.net/57fd226706400b002d000046/1485908986/logo1485908986728.png", :comment=>"VBTM 4", :auth_token=>"AQV_rrEEy8q_tNRnsgjpgtVEtXIFP5q15URkJVfsxJYqJwqvJ-7e93zOMTiN_7Em46u_M7xN9_6o5bfiRhk8LUO9fvuAu5Gw3Dg_PP4pKYlxGgyQBsoX8O4uZg39IZPuGjOkFIr29APrCYuo16Ye85JO5UMf_3Y-tkUkEJ0gesW-e9ox_gY", :key=>"x281lefk97mj", :secret=>"aulPzv3eVdRCZ1mZ", :title=>"daily w/o images", :page_id=>"tZzjni39uS”}}`;

  let value = parse(`${stream}`);
  assert.ok(value);
});
