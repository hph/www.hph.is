import React, { Component } from 'react';

import { Head } from './shared';

/**
 * Icelandic salary calculator
 *
 * Variables reference Icelandic salary concepts. Read at your own peril.
 */

const defaults = {
  year: 2019,
  byYear: {
    2018: {
      tryggingagjaldHlutfall: 6.85,
      personuafslattur: 53895,
      nedraSkattthrep: 36.94,
      efraSkattthrep: 46.24,
      threpamork: 893713,
    },
    2019: {
      tryggingagjaldHlutfall: 6.6,
      personuafslattur: 56447,
      nedraSkattthrep: 36.94,
      efraSkattthrep: 46.24,
      threpamork: 927087,
    },
  },
  onytturPersonuafslattur: 0,
  laun: '',
  tryggingagjald: 0,
  sereign: 0,
  idgjald: 8,
  skattur: 0,
  lifeyrir: 0,
  utgreiddLaun: 0,
  utgreittHlutfall: 0,
  utgreittHlutfallLif: 0,
  utgreittHlutfallKostnadur: 0,
  vidbot: 0,
  launakostnadur: 0,
  starfsendurhaefingarsjodur: 0,
};

function calculate(state) {
  const {
    tryggingagjaldHlutfall,
    personuafslattur,
    nedraSkattthrep,
    efraSkattthrep,
    threpamork,
  } = state.byYear[state.year];

  const laun = parseInt(state.laun || defaults.laun, 0) || 0;
  const idgjald = parseFloat(state.idgjald || defaults.idgjald);
  const sereign = parseFloat(state.sereign || defaults.sereign);
  const afslattur =
    parseInt(personuafslattur || defaults.personuafslattur, 0) || 0;

  const eiginVidbot = (laun * sereign) / 100;
  const gjaldstofn = laun + (laun * idgjald) / 100 + (laun * sereign) / 2 / 100;
  const eiginLifeyrir = (laun * 4) / 100;
  const lifeyrir = (laun * idgjald) / 100 + (laun * 4) / 100;
  const tekjustofn = laun - eiginLifeyrir - eiginVidbot;
  let skattur = (Math.min(tekjustofn, threpamork) / 100) * nedraSkattthrep;
  if (tekjustofn > threpamork) {
    skattur += ((tekjustofn - threpamork) / 100) * efraSkattthrep;
  }
  skattur -= afslattur;
  let onytturPersonuafslattur = 0;
  if (skattur < 0) {
    onytturPersonuafslattur = -skattur;
    skattur = 0;
  }
  const utgreiddLaun = tekjustofn - skattur;
  const tryggingagjald = (gjaldstofn * tryggingagjaldHlutfall) / 100;
  const starfsendurhaefingarsjodur = 0.001 * laun;
  const launakostnadur =
    laun +
    (laun * idgjald) / 100 +
    (laun * sereign) / 2 / 100 +
    tryggingagjald +
    starfsendurhaefingarsjodur;
  const vidbot = Math.round(eiginVidbot * 1.5);
  const utgreittHlutfall = (utgreiddLaun / laun) * 100;
  const utgreittHlutfallLif =
    ((utgreiddLaun + lifeyrir + vidbot) / launakostnadur) * 100;
  const utgreittHlutfallKostnadur = (utgreiddLaun / launakostnadur) * 100;
  return {
    launakostnadur,
    lifeyrir,
    skattur,
    starfsendurhaefingarsjodur,
    tryggingagjald,
    utgreiddLaun,
    utgreittHlutfall,
    utgreittHlutfallLif,
    utgreittHlutfallKostnadur,
    vidbot,
    onytturPersonuafslattur,
  };
}

const Field = ({ label, styles = {}, ...rest }) => (
  <label css={{ display: 'block', fontSize: 16, color: '#383838', ...styles }}>
    {label}
    <input
      css={{
        display: 'block',
        marginTop: 6,
        padding: 6,
        fontSize: 16,
        width: '100%',
        borderRadius: 2,
        outline: 'none',
        border: '1px solid #bdbdbd',
        ':focus': {
          boxShadow: '0 0px 0 2px #9ebcff',
        },
      }}
      {...rest}
    />
  </label>
);

// Convert a number to a string, with a comma between every three places of
// digits. For instance:
// In: 13700700
// Out: 13,700,700
// Implementation intentionally left imperformant in order to keep it simple.
function addCommas(n) {
  const asReversedArray = n
    .toString()
    .split('')
    .reverse();
  const withCommas = asReversedArray.reduce((acc, item, index) => {
    acc.push(item);
    if ((index + 1) % 3 === 0 && index !== asReversedArray.length - 1) {
      acc.push(',');
    }
    return acc;
  }, []);
  return withCommas.reverse().join('');
}

function formatNumber(value, { type }) {
  if (type === 'percent') {
    const withTwoDecimalPlaces = Math.round(value * 100) / 100;
    return `${withTwoDecimalPlaces}% `;
  }
  return `${addCommas(Math.round(value))} kr`;
}

const Results = ({ label, results, styles = {} }) => (
  <div css={styles}>
    <div css={{ color: '#383838', marginBottom: 6 }}>{label}</div>
    {results.map(result => (
      <div
        key={result.label}
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          fontWeight: result.main ? 600 : 400,
          ':hover': {
            backgroundColor: '#fff',
          },
        }}>
        <span
          css={{ fontSize: 16, color: result.main ? '#383838' : '#737373' }}>
          {result.label}
        </span>
        <span>{formatNumber(result.value, { type: result.type })}</span>
      </div>
    ))}
  </div>
);

export default class Calculator extends Component {
  state = {
    ...defaults,
    ...defaults.byYear[defaults.year],
  };

  onChange = ({ target }) => {
    this.setState(state => {
      const nextState = {
        ...state,
        // Input fields should not have null or undefined values, must use 0 or
        // an empty string. Quick hack to keep things simple.
        [target.name]: target.value,
      };
      return {
        ...nextState,
        ...calculate(nextState),
      };
    });
  };

  onSelect = ({ target }) => {
    this.setState(state => {
      const nextState = {
        ...state,
        ...defaults.byYear[target.value],
        year: target.value,
      };
      return { ...nextState, ...calculate(nextState) };
    });
  };

  render() {
    return (
      <div
        css={{
          width: 480,
          padding: '0 20px 30px',
          '@media (max-width: 479px)': {
            width: '100%',
          },
        }}>
        <Head tag="meta" name="description" content="Íslensk launareiknivél" />
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <h1>Launareiknivél</h1>
          <select onChange={this.onSelect}>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
          </select>
        </div>
        <div css={{ marginTop: 16, '> *': { marginBottom: 12 } }}>
          <div css={{ display: 'flex' }}>
            <Field
              label="Laun"
              name="laun"
              type="number"
              placeholder="Laun (kr.)"
              value={this.state.laun}
              onChange={this.onChange}
              styles={{ flex: 1, marginRight: 6 }}
              autoFocus
            />
            <Field
              label="Persónuafsláttur"
              name="personuafslattur"
              type="number"
              placeholder="Persónuafsláttur (kr)"
              value={this.state.personuafslattur}
              styles={{ flex: 1 }}
              onChange={this.onChange}
            />
          </div>
          <div
            css={{
              display: 'flex',
              marginTop: 16,
              '> *': { marginBottom: 12 },
            }}>
            <Field
              label="Iðgjald launagreiðanda"
              name="idgjald"
              type="number"
              step=".01"
              placeholder="Iðgjald launagreiðanda (%)"
              value={this.state.idgjald}
              onChange={this.onChange}
              styles={{ flex: 1, marginRight: 6 }}
            />
            <Field
              label="Viðbótalífeyrissparnaður"
              name="sereign"
              type="number"
              placeholder="Viðbótalífeyrissparnaður (%)"
              value={this.state.sereign}
              onChange={this.onChange}
              styles={{ flex: 1 }}
            />
          </div>
        </div>
        <div>
          <Results
            label="Launamaður"
            results={[
              { label: 'Lífeyrir', value: this.state.lifeyrir },
              { label: 'Viðbótalífeyrir', value: this.state.vidbot },
              { label: 'Skattur', value: this.state.skattur },
              {
                label: 'Ónýttur persónuafsláttur',
                value: this.state.onytturPersonuafslattur,
              },
              {
                label: 'Útgreidd laun',
                value: this.state.utgreiddLaun,
                main: true,
              },
            ]}
            styles={{
              marginBottom: 12,
            }}
          />
          <Results
            label="Launagreiðandi"
            results={[
              { label: 'Tryggingagjald', value: this.state.tryggingagjald },
              {
                label: 'Starfsendurhæfingarsjóður',
                value: this.state.starfsendurhaefingarsjodur,
              },
              {
                label: 'Launakostnaður',
                value: this.state.launakostnadur,
                main: true,
              },
            ]}
            styles={{
              marginBottom: 12,
            }}
          />
          <Results
            label="Ýmis hlutföll"
            results={[
              {
                label: 'Útgreidd laun af launum',
                value: this.state.utgreittHlutfall,
                type: 'percent',
              },
              {
                label: 'Útgreidd laun og heildarlífeyrir af launakostnaði',
                value: this.state.utgreittHlutfallLif,
                type: 'percent',
              },
              {
                label: 'Útgreidd laun af launakostnaði',
                value: this.state.utgreittHlutfallKostnadur,
                type: 'percent',
              },
            ]}
          />
        </div>
        <p
          css={{
            fontSize: 14,
            fontStyle: 'italic',
            color: '#737373',
            marginTop: 24,
          }}>
          Birt með fyrirvara um mögulegar villur.
        </p>
      </div>
    );
  }
}
