import React, { Component } from 'react';

import { Head } from './shared';

/**
 * Icelandic salary calculator
 *
 * Variables reference Icelandic salary concepts. Read at your own peril.
 */

const tryggingagjaldHlutfall = 6.85;
const personuafslattur = 53895;
const nedraSkattthrep = 36.94;
const efraSkattthrep = 46.24;
const threpamork = 893713;

const defaults = {
  laun: '',
  tryggingagjald: 0,
  sereign: 0,
  idgjald: 8,
  skattur: 0,
  lifeyrir: 0,
  utgreiddLaun: 0,
  vidbot: 0,
  launakostnadur: 0,
};

function calculate(state) {
  const laun = parseInt(state.laun || defaults.laun, 0) || 0;
  const idgjald = parseFloat(state.idgjald || defaults.idgjald);
  const sereign = parseFloat(state.sereign || defaults.sereign);

  const eiginVidbot = (laun * sereign) / 100;
  const gjaldstofn = laun + (laun * idgjald) / 100 + (laun * sereign) / 2 / 100;
  const eiginLifeyrir = (laun * 4) / 100;
  const lifeyrir = (laun * idgjald) / 100 + (laun * 4) / 100;
  const tekjustofn = laun - eiginLifeyrir - eiginVidbot;
  let skattur = (Math.min(tekjustofn, threpamork) / 100) * nedraSkattthrep;
  if (tekjustofn > threpamork) {
    skattur += ((tekjustofn - threpamork) / 100) * efraSkattthrep;
  }
  skattur = Math.max(0, skattur - personuafslattur);
  const utgreiddLaun = tekjustofn - skattur;
  const tryggingagjald = (gjaldstofn * tryggingagjaldHlutfall) / 100;
  const launakostnadur =
    laun +
    (laun * idgjald) / 100 +
    (laun * sereign) / 2 / 100 +
    tryggingagjald +
    0.001 * laun;
  const vidbot = Math.round(eiginVidbot * 1.5);
  return {
    tryggingagjald,
    skattur,
    utgreiddLaun,
    launakostnadur,
    lifeyrir,
    vidbot,
  };
}

const Field = ({ label, ...rest }) => (
  <label css={{ display: 'block', fontSize: 16, color: '#383838' }}>
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
        }}>
        <span
          css={{ fontSize: 16, color: result.main ? '#383838' : '#737373' }}>
          {result.label}
        </span>
        <span>{Math.round(result.value).toLocaleString()} kr.</span>
      </div>
    ))}
  </div>
);

export default class Calculator extends Component {
  state = defaults;

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

  render() {
    return (
      <div
        css={{
          width: 480,
          padding: '0 20px',
          '@media (max-width: 479px)': {
            width: '100%',
          },
        }}>
        <Head tag="meta" name="description" content="Íslensk launareiknivél" />
        <h1>Launareiknivél</h1>
        <div css={{ marginTop: 16, '> *': { marginBottom: 12 } }}>
          <Field
            label="Laun"
            name="laun"
            type="number"
            placeholder="Laun (kr.)"
            value={this.state.laun}
            onChange={this.onChange}
            autoFocus
          />
          <Field
            label="Iðgjald launagreiðanda"
            name="idgjald"
            type="number"
            step=".01"
            placeholder="Iðgjald launagreiðanda (%)"
            value={this.state.idgjald}
            onChange={this.onChange}
          />
          <p
            css={{
              fontSize: 14,
              fontStyle: 'italic',
              color: '#737373',
              marginTop: -6,
            }}>
            Iðgjald launagreiðanda er minnst 8% og leggst ofan á grunnlaun, en
            iðgjald launamanns er ávallt 4%.
          </p>
          <Field
            label="Viðbótalífeyrissparnaður"
            name="sereign"
            type="number"
            placeholder="Viðbótalífeyrissparnaður (%)"
            value={this.state.sereign}
            onChange={this.onChange}
          />
          <p
            css={{
              fontSize: 14,
              fontStyle: 'italic',
              color: '#737373',
              marginTop: -6,
            }}>
            Greiði launamaður viðbótalífeyri þá dregst sú upphæð af skattstofni.
            Launagreiðandi skal enn fremur greiða helming upphæðar sem
            launamaður greiðir, eða allt að 2% í viðbótalífeyri, og sú upphæð
            leggst ofan á grunnlaun til útreikningar tryggingagjalds.
          </p>
        </div>
        <div>
          <Results
            label="Launamaður"
            results={[
              { label: 'Lífeyrir', value: this.state.lifeyrir },
              { label: 'Viðbótalífeyrir', value: this.state.vidbot },
              { label: 'Skattur', value: this.state.skattur },
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
                label: 'Launakostnaður',
                value: this.state.launakostnadur,
                main: true,
              },
            ]}
          />
        </div>
      </div>
    );
  }
}
