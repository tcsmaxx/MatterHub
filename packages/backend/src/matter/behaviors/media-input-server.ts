import {
  HomeAssistantEntityInformation,
  MediaPlayerDeviceAttributes,
} from "@home-assistant-matter-hub/common";
import { HomeAssistantEntityBehavior } from "../custom-behaviors/home-assistant-entity-behavior.js";
import { MediaInputServer as Base } from "@matter/main/behaviors";
import { MediaInput } from "@matter/main/clusters";
import { applyPatchState } from "../../utils/apply-patch-state.js";

export class MediaInputServer extends Base {
  override async initialize() {
    super.initialize();
    const homeAssistant = await this.agent.load(HomeAssistantEntityBehavior);
    this.update(homeAssistant.entity);
    this.reactTo(homeAssistant.onChange, this.update);
  }

  private update(entity: HomeAssistantEntityInformation) {
    const attributes = entity.state.attributes as MediaPlayerDeviceAttributes;
    let source_idx = 0;
    const inputList = attributes.source_list?.map((source) => ({
      index: source_idx++,
      inputType: MediaInput.InputType.Other,
      name: source,
      description: source,
    }));
    let currentInput = attributes.source_list?.indexOf(attributes.source ?? "");
    if (currentInput === -1 || currentInput == null) {
      currentInput = 0;
    }
    applyPatchState(this.state, {
      inputList,
      currentInput,
    });
  }

  override async selectInput(request: MediaInput.SelectInputRequest) {
    const homeAssistant = this.agent.get(HomeAssistantEntityBehavior);
    const target = this.state.inputList[request.index];
    await homeAssistant.callAction("media_player.select_source", {
      source: target.name,
    });
  }

  override async showInputStatus() {}
  override async hideInputStatus() {}
}
