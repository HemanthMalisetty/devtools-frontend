// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import * as puppeteer from 'puppeteer';

import {$, click, resourcesPath, waitFor} from '../../shared/helper.js';

const RECORD_BUTTON_SELECTOR = '[aria-label="Record"]';
const STOP_BUTTON_SELECTOR = '[aria-label="Stop"]';

export async function navigateToPerformanceTab(target: puppeteer.Page, testName: string) {
  await target.goto(`${resourcesPath}/performance/${testName}.html`);

  // Click on the tab.
  await click('#tab-timeline');

  // Make sure the landing page is shown.
  await waitFor('.timeline-landing-page');
}

export async function startRecording() {
  await click(RECORD_BUTTON_SELECTOR);

  // Wait for the button to turn to its stop state and for the status dialog to appear.
  await Promise.all([
    waitFor(STOP_BUTTON_SELECTOR),
    waitFor('.timeline-status-dialog'),
  ]);
}

export async function stopRecording() {
  await click(STOP_BUTTON_SELECTOR);

  // Make sure the timeline details panel appears. It's a sure way to assert
  // that a recording is actually displayed as some of the other elements in
  // the timeline remain in the DOM even after the recording has been cleared.
  await waitFor('.timeline-details-chip-body');
}

export async function getTotalTimeFromSummary(): Promise<number> {
  const pieChartTotal = await $('.pie-chart-total');
  const totalText = await pieChartTotal.evaluate(node => node.textContent);
  return parseInt(totalText, 10);
}
