import {expect} from 'chai';
import {COMMUNITY_CARD_MANIFEST} from '../src/server/cards/community/CommunityCardManifest';
import {newPrelude} from '../src/server/createCard';
import {GameCards} from '../src/server/GameCards';
import {CardName} from '../src/common/cards/CardName';
import {CardManifest} from '../src/server/cards/ModuleManifest';
import {DEFAULT_GAME_OPTIONS, GameOptions} from '../src/server/game/GameOptions';
import {toName} from '../src/common/utils/utils';
import {Tag} from '../src/common/cards/Tag';

describe('GameCards', () => {
  it('correctly removes projectCardsToRemove', () => {
    // include corporate era
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      aresExtension: true,
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.contain(CardName.SOLAR_FARM);
    expect(names).to.not.contain(CardName.CAPITAL);
  });

  it('correctly separates 71 corporate era cards', () => {
    // include corporate era
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
    };
    expect(new GameCards(gameOptions).getProjectCards().length)
      .to.eq(208);

    // exclude corporate era
    gameOptions.corporateEra = false;
    expect(new GameCards(gameOptions).getProjectCards().length)
      .to.eq(137);
  });

  it('excludes expansion-specific preludes if those expansions are not selected ', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      communityCardsOption: true,
      aresExtension: false,
    };

    const preludeDeck = new GameCards(gameOptions).getPreludeCards();

    const communityPreludes = CardManifest.keys(COMMUNITY_CARD_MANIFEST.preludeCards);
    communityPreludes.forEach((preludeName) => {
      const preludeCard = newPrelude(preludeName)!;
      expect(preludeDeck.includes(preludeCard)).is.not.true;
    });
  });

  it('correctly removes the Merger prelude card if twoCorpsVariant is being used ', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      preludeExtension: true,
      twoCorpsVariant: true,
    };

    const preludeDeck = new GameCards(gameOptions).getPreludeCards();
    expect(preludeDeck).to.not.contain(CardName.MERGER);
  });

  it('CEOs: Includes/Excludes specific CEOs if those expansions are/are not selected ', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      ceoExtension: true,
      corporateEra: true,
      preludeExtension: true,
      moonExpansion: false,
    };
    const ceoNames = new GameCards(gameOptions).getCeoCards().map(toName);
    expect(ceoNames).to.contain(CardName.FLOYD); // Yes generic CEO
    expect(ceoNames).to.contain(CardName.KAREN); // Yes Prelude
    expect(ceoNames).not.to.contain(CardName.NEIL); // No Moon
  });

  it('correctly removes banned cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      bannedCards: [CardName.SOLAR_WIND_POWER],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.SOLAR_WIND_POWER);
  });

  it('correctly includes the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the standard projects', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getStandardProjects().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the preludes', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getPreludeCards().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include the included cards in the corporation cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.VENUSIAN_INSECTS],
    };
    const names = new GameCards(gameOptions).getCorporationCards().map(toName);
    expect(names).to.not.contain(CardName.VENUSIAN_INSECTS);
  });

  it('should not include corporation cards in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.POINT_LUNA],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.POINT_LUNA);
  });

  it('should not include prelude cards in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.DONATION],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.DONATION);
  });

  it('should not include standard projects in the included cards', () => {
    const gameOptions: GameOptions = {
      ...DEFAULT_GAME_OPTIONS,
      corporateEra: true,
      includedCards: [CardName.GREENERY_STANDARD_PROJECT],
    };
    const names = new GameCards(gameOptions).getProjectCards().map(toName);
    expect(names).to.not.contain(CardName.GREENERY_STANDARD_PROJECT);
  });

  const getTagsRuns = [
    {
      idx: 0,
      options: {},
      expected: [Tag.BUILDING, Tag.SPACE, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.JOVIAN, Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.CITY, Tag.EVENT],
    }, {
      idx: 1,
      options: {preludeExtension: true},
      expected: [Tag.BUILDING, Tag.SPACE, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.JOVIAN, Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.CITY, Tag.WILD, Tag.EVENT],
    }, {
      idx: 2,
      options: {venusNextExtension: true},
      expected: [Tag.BUILDING, Tag.SPACE, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.JOVIAN, Tag.VENUS, Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.CITY, Tag.EVENT],
    }, {
      idx: 3,
      options: {pathfindersExpansion: true},
      expected: [Tag.BUILDING, Tag.SPACE, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.JOVIAN, Tag.VENUS, Tag.MARS, Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.CITY, Tag.WILD, Tag.EVENT, Tag.CLONE],
    }, {
      idx: 4,
      options: {
        // Play with Pathfinders, but exclude all the Venus cards.
        pathfindersExpansion: true,
        bannedCards: [
          CardName.CULTIVATION_OF_VENUS, CardName.DYSON_SCREENS, CardName.EXPEDITION_TO_THE_SURFACE_VENUS,
          CardName.FLOATER_URBANISM, CardName.TERRAFORMING_CONTROL_STATION, CardName.THINK_TANK, CardName.VENERA_BASE,
          CardName.AMBIENT, CardName.ROBIN_HAULINGS,
        ],
      },
      expected: [Tag.BUILDING, Tag.SPACE, Tag.SCIENCE, Tag.POWER, Tag.EARTH, Tag.JOVIAN, Tag.MARS, Tag.PLANT, Tag.MICROBE, Tag.ANIMAL, Tag.CITY, Tag.WILD, Tag.EVENT, Tag.CLONE],
    },
  ] as const;
  for (const run of getTagsRuns) {
    it('getTags ' + run.idx, () => {
      const tags = new GameCards({...DEFAULT_GAME_OPTIONS, ...run.options as Partial<GameOptions>}).getTags();
      expect(tags).deep.eq(run.expected);
    });
  }
});

