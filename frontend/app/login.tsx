import { View, Text } from "react-native";

export default function LoginScreen() {
  const bgImage = require("../assets/images/login_bg.png");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: bgImage,
      }}
    >
      <Text style={{ color: "#fff" }}>Магазин</Text>
    </View>
  );
}
