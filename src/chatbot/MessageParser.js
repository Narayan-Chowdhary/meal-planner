class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    console.log(message);
    const lowercase = message.toLowerCase();

    
      if (lowercase.includes("suggest meal")) {
        this.actionProvider.suggestMeal();
      } else if (lowercase.includes("contact")) {
        this.actionProvider.contactTeam();
      } else {
        this.actionProvider.handleDefault();
      }
  }
}

export default MessageParser;
