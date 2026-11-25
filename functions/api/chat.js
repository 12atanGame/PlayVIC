export async function onRequestPost({ request, env }) {
  const apiKey = env.GEMINI_API_KEY;
  const { playerInput, character, catName, vicAffinity, hughAffinity, mapId } =
    await request.json();

  // 在這裡接上角色設定、Gemini 請求與回覆解析。

}
