const { getWallet } = require("./wallet.js");
const { getClient } = require("./client.js");
const { sendTokenAll } = require("./transactions.js");

async function sendGeneral(
  tokenInDenom,
  sourceChannel,
  recipientAddress,
  amount,
  memo
) {
  const mnemonic =
    "mobile multiply occur tenant budget woman stereo blood sausage march shell attend that other coconut axis neck trash about bonus gather board reject shell";
  const rpcEndpoint = "https://osmosis-testnet-rpc.polkachu.com";

  const wallet = await getWallet(mnemonic);
  const client = await getClient(rpcEndpoint, wallet);

  const senderAddress = "osmo1arquqm2aqmhtcmmwgxv5w2eqjka502mhjuqzvu";

  const transferResponse = await sendTokenAll(
    client,
    senderAddress,
    recipientAddress,
    amount,
    tokenInDenom,
    sourceChannel,
    memo
  );
  console.log("IBC Transfer response:", transferResponse);
}

const tokenInDenom = "uosmo";
const sourceChannel = "channel-6751";
const recipientAddress =
  "znam1qz6wurqu2dd372yu0nn28lwnlkvj3xzf8cqcg4f78cgqag32j9kxzrmjszeknu3xsgyc76ssyp2xq";
const amount = "245";
const memo =
  "0203020C02040A6991EE48C4ABFA33DAF75ACCE800805B280C71F500000000000000000000000000000000000000000000000000000000000000000001EDFC078B41BFB09BA71DB2140069AE1FCD9B68A7FCFE03A150D41536534E4E78020000000A27A726A675FFE900000000FFFFFFFF01AEAC660F7D8CBB2454815F0F8839221E31C86F82D8325907797F9FC9E7A800DEF5000000000000007E065BF1D3F0454A428D5FF590DD04EB8216B68900000001457EB07BB712836082B89180C6DF6C7B09CE32DEF8B3E35CA7BEE8E3291010022905F33A8AEFD303D0F7E9A9324DC4639DF73964BF51AC05A266F2A4747E5D186F9A2C0D28F721711474697A386C0FE6CF03EC80B43738C88F266D31BB9855CA2D2294D820AA182D09567C91D176568888640682066AA4EBA0A58B2ACD4DBF368CE11896375F77320F50A9710CA028CE4EA4AF1A46469D0D648829BA24E12060AD4427BAF294A3E91CB6FCBA2929C4CF26D1346A6033A160B92F25C5FA8D8585BDBB744FE5BEBAB09315659AB52EC48285B0FBFECB5F9520C355048B9A37CACAF3300C0126CFEFBCE95E8D28F486F26E372D0CB12F819351813777EECF7B63BFFC77A4EFBE9670B15E7A7657C8D2CC81B50FD4F5AE247E18405980006A769D1E6E5D0CE7E1B998782E983F8B4FFBBC38657C3F84A081801A4DFBDB4EA6B4DAD9ECFE1126A3D24CA26F13F741157F6EF33564B70BAD2B57F36A8FB9AB0BE57EE912E8831F545FA6B52FE00EF16F34EFD66C17A2090373CA706D344B91A364EBE465BE206E588783E047355C768B85633C7F61361F8C72A1C47B7DE3662DA7DCFA2E6752B67FDE7DFFE4E2F7721241F2010C31D7E4D5475CF10D630191C5A2491C8AED0CEC8C2D4510E4F0BEA3915CDEAAB11807F4FCAF4DF3D7DFE132432F7394355F008D31149259F7D2E34E6AAEB0727C5CEEABF579E9D48A9AADEF9116F6430B5B5675B3CBFE02DD165A95E82F1F9362F69B43D2CA689AE50C69949E6DA1F4C2FC6CFC313D384ADEA9EE62156639B09749582247AD4D8EC50808184139A7EEDF98A47F3641BB71374409FA6D96C65FD189307CA3467FF384F7AB9D9851ADF8DC18A7C97228F7184BCDCCAD3AB8F016EE1F63361498251FA3DC0EFE02230C8DA51A2592C86EC254423144040DEB827F86E2EA115FB83508780155F0823669651B0F352B8C7009BCB089BDEC113207788C7F88582268FD1E928F58B8AA99CAB476622C51488AB9FACA46461D8145D4B89CEBA4C045C1AB5B7DE53F9A4201A7E4BC741A96D8039FABF8E8EF858B63AB64351EE8E994F1DA80BBA196581DB6C629F54A7B21184C036F5656D3FDA9288FFDB2BB90D101AEAC660F7D8CBB2454815F0F8839221E31C86F82D8325907797F9FC9E7A800DE0BFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA866ED07B21C7B1BB897FEC6F0668986CE268535CE80BD4A6E6A1F21BAF8C113CD102483111CD27428B8B369B076579FAC1A6E924F28462E984D7A59C3125BF79B4241DEC4E4D6D6186648913F43FCB9040E1B909A35BAF867E2D276E986F19F0ADFE61E91023C61D9E03E6648BA52EFA8FE012F558EB9BE4BB1221DADC1BE0985617085B4383D51A2A74B0CD588F71491389915F489681E8DB63BE5483AFC5EF5D8362F2F6DDE6DAB2D766E06A87C8B3DB385B01E1AF9261AA1D345D6A80FD2FBCE6A4E84F8D2313804988BF9E02E8DB487539F8398959A884DC157EB2739173EB0392E55FD6C7CAA11D2570FD1A2B6746F8FE938D197402F7AFE7099AE6103";

sendGeneral(tokenInDenom, sourceChannel, recipientAddress, amount, memo).catch(console.error);

module.exports = sendGeneral;

